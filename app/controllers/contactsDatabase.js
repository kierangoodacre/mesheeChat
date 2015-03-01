var contacts = require('../models/contacts.js');
var contactsDatabase = contacts.db;

module.exports = function(app) {

  app.use(function(req,res,next){
    req.db = contactsDatabase;
    next();
  });

};