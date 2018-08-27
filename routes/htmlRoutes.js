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
    if (req.user) {
      res.redirect('/');
    } else {
      res.render('login');
    }
  });

  app.get('/register', function (req, res) {
    if (req.user) {
      res.redirect('/');
    } else {
      res.render('register');
    }
  });

  app.get('/account', auth.isLoggedIn, function (req, res) {
    var hbsObj = { activeUser: req.user, isAdmin: getAdmin(req) };
    res.render('account', hbsObj);
  });

  // Load index page
  app.get('/', function (req, res) {
    let opportunities = db.Opportunity.findAll({
      include: [db.User],
      order: [['deadline', 'ASC']]
    });

    let recentOpportunities = db.Opportunity.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    let adminUsers = db.User.findAll({
      where: { permissions: 'admin' },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    Promise.all([opportunities, recentOpportunities, adminUsers]).then(data => {
      const hbsObj = {
        opportunities: data[0],
        recentOpportunities: data[1],
        users: data[2],
        activeUser: req.user,
        homepage: true,
        isAdmin: getAdmin(req)
      };

      res.render('index', hbsObj);
    });
  });

  // GET for admin view of user profile who've applied to specific opportunity
  app.get('/opportunities/:opId/applicants/:userId', auth.isAdmin, function (req, res) {
    db.Opportunity.findAll({
      where: { id: req.params.opId },
      include: [{
        model: db.Collection,
        include: [db.User, db.Item],
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

  // Show the form to add opportunities.
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
        where: { UserId: req.params.id },
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
      res.render('403', { activeUser: req.user, isAdmin: getAdmin(req) });
    }
  });

  app.get('/collections', auth.isAdmin, function (req, res) {
    db.Collection.findAll({
      include: [db.Item, db.User]
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

  // apply route to get the 'selected' opportunity and 'your' collections
  app.get('/opportunities/:id/apply/:opID', auth.isLoggedIn, function (req, res) {
    let op = db.Opportunity.findOne({ where: { id: req.params.opID }, include: [db.User] });

    // uncomment `OpportunityId: null` to find only the collections that have not already been used to apply
    let collections = db.Collection.findAll({ where: { UserId: req.params.id, /* OpportunityId: null */ } });

    Promise.all([op, collections]).then(data => {
      let hbsObj = {
        opportunity: data[0],
        collections: data[1],
        activeUser: req.user,
        permissions: req.user.permissions,
        isAdmin: getAdmin(req)
      };
      res.render('apply', hbsObj);

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
