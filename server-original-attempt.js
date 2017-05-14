// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var assets = require('./assets');
var im = require('imagemagick');

var https = require('https');
var req = require('request');

var fs = require('fs');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use("/assets", assets);

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  
  
  
  
//   var im = require('imagemagick');
  
//   var url = 'https://cdn.glitch.com/b8935b6c-94cd-4f30-bcd7-df90b398ce55%2Fmask.jpg?1494471236266';
//   var url = '/assets/mask.jpg';
//   im.readMetadata(url, function(err, metadata){
//     if (err) throw err;
//     console.log('Shot at '+metadata.exif.dateTimeOriginal);
//   })
  
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

app.get("/fuck", function (request, response) {
  var output = "/tmp/fuck-" + 1 + '.jpg'
  var image = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Image-x-generic-2.svg/500px-Image-x-generic-2.svg.png"
  
  var bummer = ''
  https.get(image, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);
 
    res.setEncoding('binary')
    res.on('data', (d) => {
      bummer += d;
    });
    
    res.on('end', function(){
      // console.log(output);
      // fs.writeFileSync('/tmp/fucker.png', bummer, 'binary')
      
      var data = fs.readFileSync('/tmp/fucker.png');
      response.writeHead(200, {'Content-Type': 'image/png' })
      response.end(data)
    })

}).on('error', (e) => {
  console.error(e);
});
  
  // req(image, function(error, response, body) {
  //   // console.log(body);
  // });
  
//   var req = https.get({host: "upload.wikimedia.org", path: "/wikipedia/commons/thumb/6/64/Image-x-generic-2.svg/500px-Image-x-generic-2.svg.png"}, function(r){
//     console.log('no problems');
//     r.setEncoding('binary')
//     var img = ''

//     r.on('data', function(chunk) {
//       img += chunk
//     })

//     r.on('end', function(){
//       console.log(output);
//       fs.writeFile(output, img, 'binary')
//     })
//   })
//   console.log(req)
  
  // fs.readFile(output, function (err, data) {
  //   if (err) throw err;
  //   response.writeHead(200, {'Content-Type': 'image/png' })
  //   response.end(data)
  // });
  
  // response.write('poo-doo')
})

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
