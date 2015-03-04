var app = require('express')();
var _ = require('underscore')._;
var server = require('http').createServer(app).listen(3001, '::');
var io = require('socket.io')(server);
var path = require('path');
var express = require('express');
var people = {};
var socket = io;

var Room = require('./app/src/room.js');
var uuid = require('node-uuid');

// require('./app/models/contacts.js');

require('./app/controllers/index.js')(app);
// require('./app/controllers/database.js')(app);
// require('./app/controllers/contacts.js')(app);
// require('./app/controllers/contacts/newContact.js')(app);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));

socket.set("log level", 1);
var rooms = {};
var clients = [];
var name;


socket.on("connection", function (client) {

  client.on("join", function(username){
    roomID = null;
    name = username;
    people[client.id] = {"name" : username, "room" : roomID};
    client.emit("update", "You have connected to the server.");
    client.broadcast.emit("update", people[client.id].name + " has joined the server.")
    // socket.sockets.emit("update-people", people);
    client.emit('roomList', {rooms: rooms});
    clients.push(client);
    console.log(people);
  });

  // client.on("message", function(msg){
  //   socket.sockets.emit("chat", people[client.id], msg);
  // });

  // the problem is that it is not joining a room properly - connect the join button to the room

  client.on('message', function(msg) {
    console.log('Tried to send message');
    console.log(socket.sockets.manager);
    if(socket.sockets.manager.roomClients[client.id]['/'+client.room] !== undefined) {
      socket.sockets.in(client.room).emit('chat', people[client.id], msg);
    } else {
      client.emit('update', 'Please connect to a room');
    }
  });

  client.on("disconnect", function(){
    socket.sockets.emit("update-disconnect", name + " has left the server.");
    delete people[client.id];
    socket.sockets.emit("update-people", people);
  });

  client.on('createRoom', function(name) {
    if(people[client.id].room === null) {
      var id = uuid.v4();
      var room = new Room(name, id, client.id);
      rooms[id] = room;
      socket.sockets.emit("roomList", {rooms: rooms});

      client.room = name;
      client.join(client.room);

      room.addPerson(client.room);
      room.addPerson(client.id);

      people[client.id].room = id;
    } else {
      socket.sockets.emit("update", "You have already created a room.");
    }
  });

  client.on('joinRoom', function(id) {
    var room = rooms[id];
    if(client.id === room.owner) {
      client.emit('update', 'You are the owner of this room and you have already been joined.');
    } else {
      room.people.contains(client.id, function(found) {
        if(found) {
          client.emit('update', 'You have already joined this room.');
        } else {
          if(people[client.id].inroom !== null) {
            client.emit('update', "You are already in a room "+rooms[people[client.id].inroom].name+", please leave it first to join another room");
          } else {
            room.addPerson(client.id);
            people[client.id].inroom = id;
            client.room = room.name;
            client.join(client.room);
            user = people[client.id];
            socket.sockets.in(client.room).emit("update", user.name + " has connected to " + room.name + " room.");
            client.emit("update", "Welcome to " + room.name + ".");
            client.emit('sendRoomID', {id: id});
          };
        };
      });
    }
  });

  client.on('check', function(name, ftn){
    var match = false;
    _.find(rooms, function(key,value){
      if(key.name === name) {
        return match = true;
      }
    });
    ftn({result: match});
  });
});
