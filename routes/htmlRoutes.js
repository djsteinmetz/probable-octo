const db = require('../models');
const auth = require('../config/authHelpers');

function getAdmin(req) {
  if (req.user) {
    return req.user.permissions === 'admin';
  } else {
    return false;
  }
}

module.exports = function (app) {
  app.get('/login', function (req, res) {
    res.render('login');
  });
  app.get('/register', function (req, res) {
    res.render('register');
  });
  app.get('/changepass', auth.isLoggedIn, function (req, res) {
    res.render('changepass');
  });
  // Load index page
  app.get('/', function (req, res) {
    db.Opportunity.findAll({
      include: [db.User]
    }).then(function (dbOpportunities) {
      db.User.findAll({ where: { permissions: 'admin' } }).then(function (dbAdmin) {
        db.Opportunity.findAll({ limit: 5 }).then(function (dbRecentOp) {
          var hbsObj = {
            opportunities: dbOpportunities,
            recentOpportunities: dbRecentOp,
            users: dbAdmin,
            activeUser: req.user,
            homepage: true,
            isAdmin: getAdmin(req)
          };
          res.render('index', hbsObj);
        });
      });
    });
  });
  // GET for admin view of user profile who've applied to specific opportunity
  app.get('/opportunities/:opId/applicants/:userId', auth.isAdmin, function (req, res) {
    db.Opportunity.findAll({
      where: { id: req.params.opId },
      include: [{
        model: db.Collection,
        where: {
          OpportunityId: req.params.opId
        },
        include: [{
          model: db.User,
          where: {
            id: req.params.userId
          }
        }, { model: db.Item }]
      }]
    }).then(data => {
      var hbsObj = {
        opportunity: data[0],
        collection: data[0].Collections[0],
        items: data[0].Collections[0].Items,
        activeUser: req.user,
        isAdmin: getAdmin(req)
      };
      res.render('applicant-profile', hbsObj);
    });
  });

  // Show the form to add opportunities.  Uncomment auth.isAdmin to require auth.
  app.get('/opportunities/new', auth.isAdmin, function (req, res) {
    var hbsObj = {
      activeUser: req.user,
      isAdmin: getAdmin(req)
    };
    res.render('add-opportunity', hbsObj);
  });

  app.get('/users/:id/collections', function (req, res) {
    if (req.user.id == req.params.id) {
      db.Collection.findAll({
        where: {
          UserId: req.params.id
        },
        include: [db.Item]
      }).then(function (dbCollections) {
        var hbsObj = {
          collections: dbCollections,
          activeUser: req.user,
          isAdmin: getAdmin(req)
        };
        res.render('collections', hbsObj);
      });
    } else {
      res.status(403).send('You do not have permission to get this resource');
    }
  });
  app.get('/collections', auth.isAdmin, function (req, res) {
    db.Collection.findAll({
      include: [db.Item]
    }).then(function (dbCollections) {
      var hbsObj = {
        collections: dbCollections,
        activeUser: req.user,
        permissions: req.user.permissions,
        isAdmin: getAdmin(req)
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
      db.Collection.findAll({ where: { UserId: req.user.id } }).then(function (dbCollections) {
        var hbsObj = {
          opportunity: dbApply,
          collections: dbCollections,
          activeUser: req.user,
          permissions: req.user.permissions,
          isAdmin: getAdmin(req)
        };
        res.render('apply', hbsObj);
      });
    });
  });
  // apply route to get the 'selected' opportunity and 'your' collections
  app.get('/opportunities/:id/apply/:opID', function (req, res) {
    db.Opportunity.findOne({
      where: {
        id: req.params.opID
      },
      include: [db.User]
    }).then(function (dbApply) {
      db.Collection.findAll({ where: { UserId: req.params.id } }).then(function (dbCollections) {
        var hbsObj = {
          opportunity: dbApply,
          collections: dbCollections,
          activeUser: req.user,
          permissions: req.user.permissions,
          isAdmin: getAdmin(req)
        };
        res.render('apply', hbsObj);
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get('*', function (req, res) {
    let activeUser = req.user;
    var hbsObj = {
      activeUser: activeUser
    };
    res.render('404', hbsObj);
  });
};
