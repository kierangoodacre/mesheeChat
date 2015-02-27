describe("Homepage", function(){

  var host = 'http://localhost:3001/';


  before(function(){
    casper.start(host);
  });

  it('should contain a join button', function(){
    casper.then(function(){
      expect("#join").to.contain('join')
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