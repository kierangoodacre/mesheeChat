module.exports = function(people, client) {

  client.on("join", function(user){
    people[client.id] = user;
    client.emit("update", "You have connected to the server.");
    client.broadcast.emit("update", people[client.id] + " has joined the server.")
  });

};