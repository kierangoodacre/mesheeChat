var chai = require('chai');
var expect = chai.expect;
var io = require('socket.io-client');
var socketURL = 'http://0.0.0.0:3001';
var options ={
  transports: ['websocket'],
  'force new connection': true
};
var chatUser1 = {name:'Mihai'};
var chatUser2 = {name:'Spike'};
var chatUser3 = {name:'Roi'};

describe("Chat Server",function(){

  it('Should broadcast new user to all users', function(done){
    console.log(io);
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('join', chatUser1);

      /* Since first client is connected, we connect
         the second client. */
      var client2 = io.connect(socketURL, options);

      client2.on('connect', function(data){
        console.log('client2 connected')
        client2.emit('join', chatUser2);
      });
        // console.log('hi222222222222222222222');

      client2.on('update', function(usersName){
        expect(usersName).to.contain("You have connected"); 
        client1.on('update', function(user) {
          expect(user).to.contain('Spike has joined');
          client2.disconnect();
          client1.disconnect();
          done();
        });
  
      });

    });

    var numUsers = 0;
    // client1.on('new-user', function(usersName){
    //   numUsers += 1;

    //   if(numUsers === 2){
    //     expect(usersName).to.equal(chatUser2.name + " has joined.");
    //     client1.disconnect();
    //     done();
    //   }
    // });
  });
});