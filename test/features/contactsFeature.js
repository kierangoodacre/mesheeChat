describe("Contacts", function() {

  before(function() {
    casper.start('http://localhost:3001/');
  });

  it('should display a list of contacts', function() {
    casper.then(function() {
      expect('.contacts').to.include.text('Clint');
    });
  });

});