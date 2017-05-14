var express = require('express');
var app = express();

var fs = require('fs');
var imageMagick = require('imagemagick');
var https = require('https');
var crypto = require('crypto');

var Background = require("./lib/Background");

const key = "join_chemical car balloon";

app.use(express.static('public'));

app.get("/", function (request, response) {  
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/image", function (request, response) {
  var assetURL = 'https://cdn.glitch.com/b8935b6c-94cd-4f30-bcd7-df90b398ce55%2Fmask.jpg';
  var tmp = '/tmp/fucker.jpg';
  
  https.get(assetURL, (res) => {
    var bummer = ''
    res.setEncoding('binary')
    res.on('data', (d) => {
      bummer += d;
    });
    res.on('end', (x) => {
      fs.writeFileSync(tmp, bummer, 'binary')
      fs.readFile(tmp, function (err, data) {
          if (err) throw err;
          // response.writeHead(200, {'Content-Type': 'image/jpeg' })
          // response.end(data)
        });
    })
  });
  
//   const hash = crypto.createHash('md5').update(key).digest('hex');
  
  const hash = "fuck";
  var background = new Background(require("https"), require("imagemagick"), require("fs"), hash);
  background.get(function(filename){
    fs.readFile(filename, function (err, data) {
      if (err) throw err;
      response.writeHead(200, {'Content-Type': 'image/jpeg' })
      response.end(data)
    });
  });
});

app.get('/nothing', function (request, response) {
  // call findOne as an instance method
  // user.findOne(email, pw, callback);
  
  var hash = crypto.createHash('md5').update(key).digest('hex');
  var assetURL = 'https://cdn.glitch.com/b8935b6c-94cd-4f30-bcd7-df90b398ce55%2Fmask.jpg';
  var resizedLocal = '/tmp/' + hash + '_mask.jpg';
  var composedLocal = '/tmp/' + hash + '_mask_composed.jpg';
  
  var resizedLocal = '/tmp/' + hash + '_mask_resized.jpg'
  var https = require('https');
  var fs = require('fs');
  
  var backgroundRemote = null;
  var backgroundLocal = "/tmp/fuck.jpg";
  
  https.get(assetURL, (res) => {
    var bummer = ''
    res.setEncoding('binary')
    res.on('data', (d) => {
      bummer += d;
    });
    res.on('end', (x) => {
      fs.writeFileSync(backgroundLocal, bummer, 'binary')
      
      // var data = fs.readFileSync(backgroundLocal);
      
      var output = resizedLocal
      var msg = "STILLL MORE xOH I GUESS FOREVER AND EVER SHITS!"
      var w = 50;
      var h = 50;
      var args = [
            '-strokewidth','1',
            '-stroke','black',
            '-background','transparent',
            '-fill','white',
            '-gravity','center',
            '-size','500x500',
            // '-resize', '200x200\!',
            'caption:'+unescape(msg),
        
            output,
            // '+swap',
            '-gravity','east',    
            '-resize', '500x400^',
            '-extent', '500x400',
        
            // '-background','transparent',
            // '-fill','white',
            // '-size','300x200',
            // 'caption:'+unescape(msg),
        
            // '-size',w+'x',
            // '-composite',output
            '-composite',
            composedLocal
          ];
      
        args = [

            backgroundLocal,
          
            '-gravity','east',    
            '-resize', '500x400^',
            '-extent', '500x400',
          
          // '+swap',
            '-strokewidth','5',
            '-stroke','black',
            '-background','transparent',
            '-fill','white',
            '-gravity','south',
            // '-size', '200x100',
            "caption:"+unescape(msg),
          
            '+swap',
            // '-gravity','south',
            // '-size',w+'x',
            '-composite',backgroundLocal
          ];
      
      imageMagick.convert(args, function(){
        fs.readFile(backgroundLocal, function (err, data) {
          if (err) throw err;
          response.writeHead(200, {'Content-Type': 'image/jpeg' })
          response.end(data)
        });
      });
      
      
      // response.writeHead(200, {'Content-Type': 'image/png' })
      // response.end(data)
    })
  })
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});