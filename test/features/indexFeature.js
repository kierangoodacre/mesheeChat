var expect = require('chai').expect;
var webdriverio = require ('webdriverio');

describe('Homepage', function() {

  var client = {};

  before(function(done) {
    client = webdriverio.remote({ desiredCapabilities: { browserName: 'chrome'}});
    client.init(done)
  });

  after(function(done) {
    client.end(done)
  });

  function createOneUser() {
    client
      .url('http://localhost:3001')
      .setValue('#name', 'Clint')
      .click('#join')
    return client;
  };

  function createTwoUsers() {
    createOneUser('Clint')
      .newWindow('http://localhost:3001', 'Chat 2')
      .setValue('#name', 'Jake')
      .click('#join')
    return client;
  };

  it('should let a user know when a message has been sent', function(done){
   createOneUser('Clint')
    .setValue('#msg', 'Hi from Clint')
    .click('#send')
    .getText('#msgs', function(err, text){
      expect(text).to.contain('Hi from Clint')
    })
    .call(done);
  });

  it('should let a user know who is talking', function(done) {
    createOneUser('Clint')
    .setValue('#msg', 'Hi from Clint')
    .click('#send')
    .getText('#msgs', function(err, text){
      expect(text).to.contain('Clint:')
    })
    .call(done);
  });

  it('should tell user when it has connected', function(done) {
    createOneUser('Clint')
      .getText('#msgs', function(err, text){
        expect(text).to.contain('You have connected to the server.')
      })
      .call(done);
  });

  it('should let a user know when someone has disconnected from the server', function(done){
    createTwoUsers()
      .close()
      .getText('#msgs', function(err, text){
        expect(text).to.contain('Jake has left the server')
      })
      .call(done);
  });

  it('should update node list when a user joins', function(done) {
    createTwoUsers()
      .switchTab()
      .getText('#msgs', function(err, text) {
        expect(text).to.contain('Jake has joined the server.')
      })
      .call(done);
  });

});