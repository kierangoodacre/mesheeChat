describe("Homepage", function(){

  var host = 'http://localhost:3000/';

  before(function(){
    casper.start(host);
  });

  it('should contain a send button', function(){
    casper.then(function(){
      expect("#send-msg").to.have.text('Send')
    });
  });

  it('should see message once sent', function(){
    casper.then(function(){
      this.fill('form[id="post-message"]',{
        message: 'hello'
      }, true);
      this.click('button[id="send-msg"]')
      expect("#message").to.have.text('hello');
    });
  });
});