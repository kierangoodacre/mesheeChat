// var chai = require('chai');
// var expect = chai.expect;
// var io = require('socket.io-client');
// var socketURL = 'http://localhost:3001';
// var options = {
//   transports: ['websocket'],
//   'forceNew': true
// };

// var _ = require('underscore');

// var chatUser1 = 'Nick';
// var chatUser2 = 'Alex';

// describe('socketRoom', function() {

//   var client1;

//   before(function() {
//     client1 = io.connect(socketURL, options);
//     client1.on('connect', function(data){
//       client1.emit('join', 'Jake');
//       client1.emit('createRoom', 'JakeRoom');
//     });
//   });

//   it('should be able to create a room', function(done){
//     client1.on('roomList', function(rooms){
//       console.log(rooms);
//       expect(_.values(rooms)).to.contain('JakeRoom');
//       client1.disconnect();
//       done();
//     });

//   });

// });