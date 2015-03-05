var io                = require('socket.io');
var socketJoin        = require('./socketJoin');
var socketMessage     = require('./socketMessage');
var socketDisconnect  = require('./socketDisconnect');
var socketUserList    = require('./socketUserList');
var people            = {};

var Sockets = function(server) {
  socket = io(server);
  socket.on("connection", function (client) {

    socketJoin(people, client);
    socketMessage(people, client);
    socketDisconnect(people, client);
    socketUserList(people,client);

  });
};

module.exports = Sockets;