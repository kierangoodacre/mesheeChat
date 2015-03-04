var io = require('socket.io');
var people = {};

var Sockets = function(server) {
  socket = io(server);
  socket.on("connection", function (client) {
    client.on("join", function(user){
      people[client.id] = user;
      client.emit("update", "You have connected to the server.");
      client.broadcast.emit("update", people[client.id] + " has joined the server.")
      console.log(people);
    });

    client.on("message", function(msg){
      socket.sockets.emit("chat", people[client.id], msg);
    });

    client.on("disconnect", function(){
      socket.sockets.emit("update-disconnect", people[client.id] + " has left the server.");
      delete people[client.id];
      socket.sockets.emit("update-people", people);
    });

    client.on('user-list', function(user){
      client.emit("logged-in-users", people);
   });
  }); 
}

module.exports = Sockets;