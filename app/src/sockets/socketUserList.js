module.exports = function(people, client) {

  client.on('user-list', function(user){
    client.emit("logged-in-users", people);
  });

};