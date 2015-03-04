var app = require('express')();
var server = require('http').createServer(app).listen(3001, '::');
var io = require('socket.io')(server);
var path = require('path');
var express = require('express');
var people = {};
var socket = io;

// require('./app/models/contacts.js');

require('./app/controllers/index.js')(app);
// require('./app/controllers/database.js')(app);
// require('./app/controllers/contacts.js')(app);
// require('./app/controllers/contacts/newContact.js')(app);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));


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
