var expect = require('chai').expect;
var webdriverio = require ('webdriverio');

describe('Cryptography test', function() {

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

  it('see message if enter the correct key', function(done) {
    inputName()
      .setValue('#cipher', 'meshee')
      .setValue('#decipher', 'meshee')
      .setValue('#msg', 'Hi, I am here')
      .click('#send')
      .getText('#msgs', function(err, text){
        expect(text).to.contain('Hi, I am here')
      })
      .call(done);
  });

  it('see message if enter the wrong key', function(done) {
    inputName()
      .setValue('#cipher', 'meshee')
      .setValue('#decipher', 'mesh')
      .setValue('#msg', 'Hi, I am here')
      .click('#send')
      .getText('#msgs', function(err, text){
        expect(text).not.to.contain('Hi, I am here')
      })
      .call(done);
  });

});