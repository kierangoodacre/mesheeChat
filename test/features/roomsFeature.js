var expect = require('chai').expect;
var webdriverio = require ('webdriverio');

describe('Rooms', function() {

  var client = {};

  before(function(done) {
    client = webdriverio.remote({ desiredCapabilities: { browserName: 'chrome'}});
    client.init(done)
  });

  after(function(done) {
    client.end(done)
  });

  function inputName(name) {
    client
      .url('http://localhost:3001')
      .setValue('#name', name)
      .click('#join')
    return client;
  };

  it('should display when there are no rooms', function(done) {
    inputName('Clint')
      .getText('body', function(err, text) {
        expect(text).to.contain("There are no rooms yet.")
      })
      .call(done);
  });

  it('should enable users to create rooms', function(done) {
    inputName('Clint')
      .setValue('#create-room-name', "Clint's Room")
      .click('#create-room-btn')
      .getText('#msgs', function(err, text){
        expect(text).to.contain("Clint's Room created")
      })
      .call(done);
  });

  it('should display a list of rooms', function(done) {
    inputName('Jake')
      .getText('body', function(err, text) {
        expect(text).to.contain("Clint's Room")
      })
      .call(done);
  });

  // it('should send a message only to those in the room', function(done) {
  //   inputName('Dave')
  //     .click('#joinroom')
  //     .newWindow('http://localhost:3001')
  //     .setValue('#name', 'Jake')
  //     .click('#join')
  //     .setValue('#msg', 'Hello')
  //     .click('#send')
  //     .switchTab()
  //     .getText('#msgs', function(err, text){
  //       expect(text).not.to.contain('Hello')
  //     })
  //     .call(done);
  // });


});