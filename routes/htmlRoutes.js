const db = require('../models');
const auth = require('../config/authHelpers');

module.exports = function (app) {
  app.get('/login', function (req, res) {
    res.render('login');
  });
  app.get('/register', function (req, res) {
    res.render('register');
  });
  function getAdmin(req) {
    if (req.user) {
      return req.user.permissions === 'admin';
    } else {
      return false;
    }
  }
  // Load index page
  app.get('/', function (req, res) {
    db.Opportunity.findAll({
      include: [db.User]
    }).then(function (dbOpportunities) {
      db.User.findAll({where: {permissions: 'admin'}}).then(function (dbUsers) {
        db.Opportunity.findAll({ limit: 5 }).then(function (dbRecentOp) {
          var hbsObj = {
            opportunities: dbOpportunities,
            recentOpportunities: dbRecentOp,
            users: dbUsers,
            activeUser: req.user,
            homepage: true,
            isAdmin: getAdmin(req)
          };
          console.log(hbsObj);
          res.render('index', hbsObj);
        });
      });
    });
  });

  // Show the form to add opportunities.  Uncomment auth.isAdmin to require auth.
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
    };
    res.render('add-opportunity', hbsObj);
  });

  // Load example page and pass in an example by id
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
    db.Collection.findAll({
      include: [db.Item]
    }).then(function (dbCollections) {
      var hbsObj = {
        collections: dbCollections,
        activeUser: req.user,
        isAdmin: admin
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
      var admin;
      if(req.user) {
        if (req.user.permissions === 'admin') {
          admin = true;
        } else {
          admin = false;
        }
      }
      db.Collection.findAll({}).then(function (dbCollections) {
        var hbsObj = {
          opportunity: dbApply,
          collections: dbCollections,
          activeUser: req.user,
          isAdmin: admin
        };
        console.log(hbsObj);
        res.render('opportunity-details', hbsObj);
      });
    });
  });
  // apply route to get the 'selected' opportunity and 'your' collections
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
        var hbsObj = {
          opportunity: dbApply,
          collections: dbCollections,
          activeUser: req.user,
          isAdmin: admin
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
