module.exports = function(people, client) {

  client.on("disconnect", function(){
    socket.sockets.emit("update-disconnect", people[client.id] + " has left the server.");
    delete people[client.id];
    socket.sockets.emit("update-people", people);
  });

};