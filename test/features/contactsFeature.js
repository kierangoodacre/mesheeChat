describe("Contacts", function() {

  before(function() {
    casper.start('http://localhost:3001/contacts');
  });

  it('should display a list of contacts', function() {
    casper.then(function() {
      expect('#contact-name').to.contain.text('clint');
    });
  });

});