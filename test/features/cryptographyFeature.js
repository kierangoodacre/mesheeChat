var expect = require('chai').expect;
var webdriverio = require ('webdriverio');

describe('Cryptography test', function() {

  var client_crypt = {};
  var client_crypt2 = {};

  before(function(done) {
    client_crypt = webdriverio.remote({ desiredCapabilities: { browserName: 'chrome'}});
    client_crypt.init(done);
  });

  before(function(done) {
    client_crypt2 = webdriverio.remote({ desiredCapabilities: { browserName: 'chrome'}});
    client_crypt2.init(done);
  });

  after(function(done) {
    client_crypt.end(done);
  });

  after(function(done) {
    client_crypt2.end(done);
  })

  function inputName() {
    client_crypt
      .url('http://localhost:3001')
      .setValue('#name', 'Clint')
      .click('#join')
    return client_crypt;
  };

  function inputName2() {
    client_crypt2
      .url('http://localhost:3001')
      .setValue('#name', 'Jake')
      .click('#join')
    return client_crypt2;
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
      .waitFor('#msgs', 500)
    
    client_crypt
      .getText('#msgs', function(err, text) {
        expect(text).to.contain('Hi, I am Clint');
      })
      .getText('#msgs', function(err, text) {
        expect(text).to.not.contain('Hi, I am Jake');
      })
      .call(done);
  });

});