var chai = require('chai');
var expect = chai.expect;
var io = require('socket.io-client');
var socketURL = 'http://0.0.0.0:3001';
var options ={
  transports: ['websocket'],
  'force new connection': true
};
var chatUser1 = 'Nick'
var chatUser2 = 'Alex'
var chatUser3 = 'Rich'

var message1 = 'Hey there'


describe("Chat Server",function(){

  it('Should broadcast new user to all users', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('join', chatUser1);

      /* Since first client is connected, we connect
         the second client. */
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

    var numUsers = 0;
    client1.on('new-user', function(usersName){
      numUsers += 1;

      if(numUsers === 2){
        expect(usersName).to.equal(chatUser2.name + " has joined.");
        client1.disconnect();
        done();
      }
    });
  });

  it('Should broadcast to users when a user has left room', function(done){

    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('join', chatUser1);

      var client2 = io.connect(socketURL, options);

      client2.on('connect', function(data){
        client2.emit('join', chatUser2);
        client2.on('disconnect', function(usersName){
          client1.on('update-disconnect', function(user){
            expect(user).to.contain( chatUser2 + ' has left the server')
            done();
          });
        });
        client2.disconnect();
      });
    });
  });

  // it('Should broadcast to users when a user has sent a message', function(done){

  //   var client1 = io.connect(socketURL, options);

  //   client1.on('connect', function(data){
  //     client1.emit('join', chatUser1);

  //     var client2 = io.connect(socketURL, options);

  //     client2.on('connect', function(data){
  //       client2.emit('join', chatUser2);
  //     });
      
  //     client2.on('send', function(msg){
  //     console.log('WWWWWWWWWWWW')
  //       client2.emit('chat', function(data){
  //         client1.on('send', function(data){
  //           expect(data).to.contain(data);
  //         });
  //       });
  //     });
  //   });

  // });
});