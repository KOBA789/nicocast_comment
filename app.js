var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    static = require('./handler'),
    redis = require("redis"),
    client = redis.createClient(),
    handler, app, io;

const MAX_TEXT_LENGTH = 140,
      PORT = 8124;

handler = static.createHandler(fs.realpathSync('./public'));
app = http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname;
  if (path == '/') {
    path = 'index.html';
  }
  if (!handler.handle(path, req, res)) {
    res.writeHead(404);
    res.end('404 Not Found');
  }
});

app.listen(PORT);
io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket) {
  client.lrange(function (err, comments) {
    if (err) return;
    socket.emit('log', comments);
  });

  var channelName = '';

  socket.emit('getChannelName', function (_channelName) {
    channelName = _channelName;
    socket.join(channelName);
  });

  socket.on('post', function (text) {
    if (typeof text === 'string' && text.length <= MAX_TEXT_LENGTH) {
      socket.broadcast.to(channelName).emit('comment', {text: text});
    }
  });
});