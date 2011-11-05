var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    static = require('./handler'),
    redis = require("redis"),
    client = redis.createClient(),
    handler, app, io;

const MAX_TEXT_LENGTH = 140,
      PORT = 2525;

handler = static.createHandler(fs.realpathSync('./public'));
app = http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname;
  if (path === '/') {
    path = '/index.html';
  }
  if (!handler.handle(path, req, res)) {
    res.writeHead(404);
    res.end('404 Not Found');
  }
});

app.listen(PORT);
io = require('socket.io').listen(app);

function canConnect (handshakeData) {
  if (handshakeData.xdomain === false) return true;
  var originHost = url.parse(handshakeData.headers.origin).hostname;
  if (originHost === 'live.nicocast.com' || originHost === 'localhost') return true;
  return false;
}

io.configure(function () {
  io.set('authorization', function (handshakeData, callback) {
    callback(null, canConnect(handshakeData));
  });
});

io.sockets.on('connection', function (socket) {
  socket.on('channelName', function (channelName) {
    if (typeof channelName !== 'string') return;
    client.lrange('clog-' + channelName, 0, 100, function (err, log) {
      log.reverse();
      socket.emit('log', log);
    });
    socket.set('channelName', channelName);
    socket.join(channelName);
  });

  socket.on('post', function (text) {
    if (typeof text === 'string' && text.length > 0 && text.length <= MAX_TEXT_LENGTH) {
      socket.get('channelName', function (err, channelName) {
	var comment = {text: text};
	socket.broadcast.to(channelName).emit('comment', comment);
	client.lpush('clog-' + channelName, JSON.stringify(comment), function (err) {
	  if (err) console.err(err);
	});
      });
    }
  });
});