var should = require('should');
var chai = require('chai');
var expect = chai.expect;
var io = require('socket.io-client');
var socketURL = 'http://localhost:3001';
var options = {
  transports: ['websocket'],
  'forceNew': true
};
var chatUser1 = 'Nick';
var chatUser2 = 'Alex';
var chatUser3 = 'Rich';

var message1 = 'Hey there';

var client1, client2, client3;
var messages = 0;
var message = "Hello World";

var checkMessage = function(client, done) {
  client.on('chat', function(who, msg){
    message.should.equal(msg);
    client.disconnect();
    messages++;
    if (messages === 3 ){
      done();
    };
  });
};

describe("Chat Server",function(){

  it('should broadcast new user to all users', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('join', chatUser1);
      var client2 = io.connect(socketURL, options);

      client2.on('connect', function(data){
        client2.emit('join', chatUser2);
      });

      client2.on('update', function(usersName){
        expect(usersName).to.contain("You have connected");
        client1.on('update', function(user) {
          expect(user).to.contain(chatUser2 + ' has joined the server.');
          client2.disconnect();
          client1.disconnect();
          done();
        });

      });

    });
  });

  it('should broadcast to users when a user has left room', function(done){

    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('join', chatUser1);

      var client2 = io.connect(socketURL, options);

      client2.on('connect', function(data){
        client2.emit('join', chatUser2);
        client2.on('disconnect', function(usersName){
          client1.on('update-disconnect', function(user){
            expect(user).to.contain(chatUser2 + ' has left the server')
            client1.disconnect();
            done();
          });
        });
        client2.disconnect();
      });
    });
  });

  it('Should be able to broadcast messages to other sockets', function(done){

    client1 = io.connect(socketURL, options);
    checkMessage(client1, done);

    client1.on('connect', function(data){
      client2 = io.connect(socketURL, options);
      checkMessage(client2, done);

      client2.on('connect', function(data){
        client3 = io.connect(socketURL, options);
        checkMessage(client3, done);

        client3.on('connect', function(data){
          client2.emit('message', 'Hello World');
        });
      });
    });
  });
});
