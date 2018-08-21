var db = require('../models');

module.exports = function(app) {
  // Load index page
  app.get('/', function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.render('index', {
        msg: 'Welcome!',
        examples: dbExamples
      });
    });
  });

  
  app.get('/apply/:id', function(req, res) {
    res.render('apply');
  });

  app.get('/sign-up'), function(req, res) {
    res.render('sign-up');
  });

  app.get('/opportunities/:id,'), function(req, res) {
    res.render('opportunities');
  });

  app.get('/user/:id'), function(req, res) {
    res.render('user');
  });

  app.get('/admin/:id'), function(req, res) {
    res.render('amin');
  });

  // Load example page and pass in an example by id
  app.get('/example/:id', function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      res.render('example', {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get('*', function(req, res) {
    res.render('404');
  });
};
