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

  it('should see their name after submitting their name', function() {
    casper.then(function() {

      this.fill('form[id="name-form"]',{
        join: 'Clint'
      }, true);

      this.click('input[id="join"]');
        setTimeout(function() {
          expect('body').to.contain.text('Clint');
      }, 1000);
    });
  });

});