module.exports = function(people, client) {

  client.on("message", function(message){
    socket.sockets.emit("chat", people[client.id], message);
  });

};