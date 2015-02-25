var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

io.on('connection', function(socket){
  socket.on('user connected', function(socket){
    io.emit('user connected', socket);
  });
});

app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});

http.listen(process.env.PORT || 3000, function(){
 console.log('listening');
});