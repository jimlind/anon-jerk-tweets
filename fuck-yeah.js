http   = require('http')
https  = require('https')
fs     = require('fs')
url    = require('url')

req    = require('request')
server = require('node-router').getServer()
im     = require('imagemagick')

function fetch(query,cb){
  cb("https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Image-x-generic-2.svg/500px-Image-x-generic-2.svg.png");
}

function download(match, output, addText){
  fetch(match, function(file){
    var uri  = url.parse(file)
      , host = uri.hostname
      , path = uri.pathname

    if(uri.protocol == "https:")
      var r = https
    else
      var r = http

    request = r.get({host: host, path: path}, function(res){
      res.setEncoding('binary')
      var img = ''

      res.on('data', function(chunk) {
        img += chunk
      })

      res.on('end', function(){
        fs.writeFile(output, img, 'binary', function (err) {
          if (err) throw err
        })
        addText()
      })
    })
  })
}

server.get("/fuck", function(request, response){
  response.simpleHtml(200, 'fuck yeah / by <a href="http://twitter.com/holman">@holman</a>.'+
    '<p>api: use <b>fuckyeah.herokuapp.com/[your-query]</b> and shit.</p>'
  );
})

server.get("/fuck/favicon.ico", function(request, response){
  return ""
})

server.get(new RegExp("^/(.*?)(?:.jpg)?$"), function(request, response, match) {
  var msg   = ""
    , match = escape(match.toUpperCase())
    , chars = match.length

  if(chars < 7)
    msg = 'FUCK YEAH ' + match + ''
  else
    msg = 'FUCK YEAH \n' + match + ''

  var output = "/tmp/fuck-" + Math.floor(Math.random(10000000)*10000000) + '.jpg'
  download(match, output, function(){
    im.identify(output,function(err,features){
      if (err)
        return;
      var h = features.height < 100 ? features.height : 100
        , w = features.width < 500 ? features.width : 500
        , args = [
            '-strokewidth','2',
            '-stroke','black',
            '-background','transparent',
            '-fill','white',
            '-gravity','center',
            '-size',w+'x'+h,
            "caption:"+unescape(msg),
            output,
            '+swap',
            '-gravity','south',
            '-size',w+'x',
            '-composite',output
          ];
      im.convert(args, function(){
        fs.readFile(output, function (err, data) {
          if (err) throw err;
          response.writeHead(200, {'Content-Type': 'image/jpeg' })
          response.end(data)
        });
      });
    });
  })
})

server.listen(process.env.PORT || 8080, '0.0.0.0')