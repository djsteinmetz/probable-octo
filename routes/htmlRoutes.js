const db = require('../models');
const auth = require('../config/authHelpers');

module.exports = function (app) {
<<<<<<< HEAD
  app.get('/login', function(req, res) {
    res.render('login');
  });
  app.get('/register', function(req, res) {
    res.render('register');
  });
  app.get('/changepass', function(req, res) {
    res.render('changepass');
  });
  // Load index page
  app.get('/', function (req, res) {
    db.Opportunity.findAll({
      include: [db.User]
    }).then(function (dbOpportunities) {
      db.User.findAll({}).then(function (dbUsers) {
        db.Opportunity.findAll({limit: 5}).then(function(dbRecentOp) {
=======
  app.get('/login', function (req, res) {
    res.render('login');
  });
  app.get('/register', function (req, res) {
    res.render('register');
  });

  // Load index page
  app.get('/', function (req, res) {
    var admin;
    if (req.user) {
      if (req.user.permissions === 'admin') {
        admin = true;
      } else {
        admin = false;
      }
    }
    console.log('ADMIN STATUS: ', admin);
    db.Opportunity.findAll({
      include: [db.User]
    }).then(function (dbOpportunities) {
      db.User.findAll({where: {permissions: 'admin'}}).then(function (dbUsers) {
        db.Opportunity.findAll({ limit: 5 }).then(function (dbRecentOp) {
>>>>>>> da84f94328b286460091d8ead750da13aa9f4e37
          var hbsObj = {
            opportunities: dbOpportunities,
            recentOpportunities: dbRecentOp,
            users: dbUsers,
<<<<<<< HEAD
            activeUser: req.user
=======
            activeUser: req.user,
            homepage: true,
            isAdmin: admin
>>>>>>> da84f94328b286460091d8ead750da13aa9f4e37
          };
          console.log(hbsObj);
          res.render('index', hbsObj);
        });
      });
    });
  });

  // Show the form to add opportunities.  Uncomment auth.isAdmin to require auth.
<<<<<<< HEAD
  app.get('/opportunities/new', /* auth.isAdmin, */ function (req, res) {
    var hbsObj = {
      activeUser: req.user,
      permissions: req.user.permissions
=======
  app.get('/opportunities/new', auth.isAdmin, function (req, res) {
    var admin;
    if (req.user) {
      if (req.user.permissions === 'admin') {
        admin = true;
      } else {
        admin = false;
      }
    }
    var hbsObj = {
      activeUser: req.user,
      isAdmin: admin
>>>>>>> da84f94328b286460091d8ead750da13aa9f4e37
    };
    res.render('add-opportunity', hbsObj);
  });

  // Load example page and pass in an example by id
<<<<<<< HEAD
  app.get('/collections', function (req, res) {
=======
  app.get('/users/:id/collections', function (req, res) {
    if (req.user.id == req.params.id) {
      db.Collection.findAll({
        where: {
          UserId: req.params.id
        },
        include: [db.Item]
      }).then(function (dbCollections) {
        console.log('!~~~~~', dbCollections);
        var admin;
        if (req.user) {
          if (req.user.permissions === 'admin') {
            admin = true;
          } else {
            admin = false;
          }
        }
        var hbsObj = {
          collections: dbCollections,
          activeUser: req.user,
          isAdmin: admin
        };
        res.render('collections', hbsObj);
      });
    } else {
      res.status(403).send('You do not have permission to get this resource');
    }
  });
  app.get('/collections', auth.isAdmin, function (req, res) {
    var admin;
    if (req.user) {
      if (req.user.permissions === 'admin') {
        admin = true;
      } else {
        admin = false;
      }
    }
>>>>>>> da84f94328b286460091d8ead750da13aa9f4e37
    db.Collection.findAll({
      include: [db.Item]
    }).then(function (dbCollections) {
      var hbsObj = {
        collections: dbCollections,
        activeUser: req.user,
<<<<<<< HEAD
        permissions: req.user.permissions
=======
        isAdmin: admin
>>>>>>> da84f94328b286460091d8ead750da13aa9f4e37
      };
      res.render('collections', hbsObj);
    });
  });
  // details route to get the 'selected' opportunity and display more details
  app.get('/opportunities/:id', function (req, res) {
    db.Opportunity.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User]
    }).then(function (dbApply) {
<<<<<<< HEAD
=======
      var admin;
      if(req.user) {
        if (req.user.permissions === 'admin') {
          admin = true;
        } else {
          admin = false;
        }
      }
>>>>>>> da84f94328b286460091d8ead750da13aa9f4e37
      db.Collection.findAll({}).then(function (dbCollections) {
        var hbsObj = {
          opportunity: dbApply,
          collections: dbCollections,
          activeUser: req.user,
<<<<<<< HEAD
          permissions: req.user.permissions
=======
          isAdmin: admin
>>>>>>> da84f94328b286460091d8ead750da13aa9f4e37
        };
        console.log(hbsObj);
        res.render('opportunity-details', hbsObj);
      });
    });
  });
  // apply route to get the 'selected' opportunity and 'your' collections
<<<<<<< HEAD
  app.get('/opportunities/:id/apply', function (req, res) {
    db.Opportunity.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User]
    }).then(function (dbApply) {
      db.Collection.findAll({}).then(function (dbCollections) {
=======
  app.get('/opportunities/:id/apply/:opID', function (req, res) {
    var admin;
    if(req.user) {
      if (req.user.permissions === 'admin') {
        admin = true;
      } else {
        admin = false;
      }
    }
    db.Opportunity.findOne({
      where: {
        id: req.params.opID
      },
      include: [db.User]
    }).then(function (dbApply) {
      db.Collection.findAll({where: {UserId: req.params.id}}).then(function (dbCollections) {
>>>>>>> da84f94328b286460091d8ead750da13aa9f4e37
        var hbsObj = {
          opportunity: dbApply,
          collections: dbCollections,
          activeUser: req.user,
<<<<<<< HEAD
          permissions: req.user.permissions
=======
          isAdmin: admin
>>>>>>> da84f94328b286460091d8ead750da13aa9f4e37
        };
        console.log(hbsObj);
        res.render('apply', hbsObj);
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get('*', function (req, res) {
    res.render('404');
  });
};
