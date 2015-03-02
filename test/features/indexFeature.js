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

  function inputName() {
    client
      .url('http://localhost:3001')
      .setValue('#name', 'Clint')
      .click('#join')
    return client;
  };

  it('should tell user when it has connected', function(done) {
    inputName()
      .getText('#msgs', function(err, text){
        expect(text).to.contain('You have connected to the server.')
      })
      .call(done);
  });

  it('should let a user know when a message has been sent', function(done){
   inputName()
    .setValue('#msg', 'Hi from Clint')
    .click('#send')
    .getText('#msgs', function(err, text){
      expect(text).to.contain('Hi from Clint')
    })
    .call(done);
  });

});