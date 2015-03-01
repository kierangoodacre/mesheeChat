module.exports = function(app) {

  app.get('/contacts', function(req, res) {
    var db = req.db;
    var contacts = db.get('contacts');
    contacts.find({},{}, function(error, docs) {
      res.render('contacts', {
        "contacts" : docs
      });
    });
  });

};