var path = require('path')

module.exports = function(app) {

  app.get('/', function(req, res){
    var index = path.resolve('views/index.html');
    res.sendFile(index);
  });

};