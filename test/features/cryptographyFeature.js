var expect = require('chai').expect;
var webdriverio = require ('webdriverio');

describe('Cryptography test', function() {

  var client = {};
  var client2 = {};

  before(function(done) {
    client = webdriverio.remote({ desiredCapabilities: { browserName: 'chrome'}});
    client.init(done);
  });

  before(function(done) {
    client2 = webdriverio.remote({ desiredCapabilities: { browserName: 'chrome'}});
    client2.init(done);
  });

  after(function(done) {
    client.end(done);
  });

  after(function(done) {
    client2.end(done);
  })

  function inputName() {
    client
      .url('http://localhost:3001')
      .setValue('#name', 'Clint')
      .click('#join')
    return client;
  };

  function inputName2() {
    client2
      .url('http://localhost:3001')
      .setValue('#name', 'Jake')
      .click('#join')
    return client2;
  };

  it('see message if enter the correct key', function(done) {
    inputName()
      .setValue('#key', 'meshee')
      .setValue('#msg', 'Hi, I am here')
      .click('#send')
      .getText('#msgs', function(err, text){
        expect(text).to.contain('Hi, I am here')
      })
      .call(done);
  });

  it('cannot see anything if enter the wrong key', function(done) {
    inputName()
      .setValue('#key', 'mesh')
      .setValue('#msg', 'Hi, I am Clint')
      .click('#send')
      .getText('#msgs', function(err, text){
        expect(text).to.contain('Hi, I am Clint')
      })

    inputName2()
      .setValue('#key', 'meshee')
      .setValue('#msg', 'Hi, I am Jake')
      .click('#send')
      .getText('#msgs', function(err, text){
        expect(text).to.contain('Hi, I am Jake');
      })
    
    client
      .getText('#msgs', function(err, text){
        expect(text).to.contain('Hi, I am Clint');
        expect(text).to.not.contain('Hi, I am Jake');
      })
      .call(done);
  });

});