function Background(https, imageMagick, fileSystem, hash) {
  this.https = https;
  this.imageMagick = imageMagick;
  this.fileSystem = fileSystem;
  this.localFile = "/tmp/" + hash + "_background.jpg";
  this.assetURL = "https://cdn.glitch.com/b8935b6c-94cd-4f30-bcd7-df90b398ce55%2Fmask.jpg";
  this.imageBody = '';
}

Background.prototype.get = function (callBack) {
  // If the file exists locally, just return it
  this.fileSystem.access(this.localFile, (error) => {
    if (null === error) {
      return this.localFile;
    }
  })

  this.https.get(this.assetURL, (response) => {
    response.setEncoding("binary")
    response.on("data", (chunk) => { this.imageBody += chunk; });
    response.on("end", this.writeFile.bind(this, callBack));
  });      
}

Background.prototype.writeFile = function (callBack) {
  this.fileSystem.writeFile(
    this.localFile,
    this.imageBody,
    "binary",
    () => {
      // When done, clean up memory and prepare file
      this.imageBody = "";
      this.prepareFile(callBack);
    }
  );
}

Background.prototype.prepareFile = function (callBack) {
  const args = [
    this.localFile,
    '-resize', '500x300^',
    '-extent', '500x300',
    this.localFile,
  ];
  
  this.imageMagick.convert(args, () => {callBack(this.localFile)});
}

module.exports = Background;