var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var express = require('express');
var people = {};
var socket = io;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

socket.on("connection", function (client) { 
    client.on("join", function(user){
        people[client.id] = user;
        client.emit("update", "You have connected to the server.");
        client.broadcast.emit("update", user.name + " has joined the server.")
        // socket.sockets.emit("update-people", people);
        console.log(people);
    });

    // client.on('connection-name', function(data) {
    //     console.log(data)
    //     socket.sockets.emit('new-user', data);
    // });

    client.on("send", function(msg){
        socket.sockets.emit("chat", people[client.id], msg);
    });

    client.on("disconnect", function(){
        socket.sockets.emit("update", people[client.id] + " has left the server.");
        delete people[client.id];
        socket.sockets.emit("update-people", people);
    });
});

socket.sockets.on('connection', function(client){
    client.on('create', function(room){
        socket.join(room);
    });
});

http.listen(process.env.PORT || 3001, function(){
  console.log('listening on *:3001');
});