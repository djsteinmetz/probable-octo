const db = require('../models');
const auth = require('../config/authHelpers');

module.exports = function (app) {

  /******************\
  |  PUBLIC ROUTING  |
  \******************/

  app.get('/api/users/:id/collections', function (req, res) {
    db.Collection
      .findAll({ where: { UserId: req.params.id } })
      .then(function (dbCollection) {
        res.json(dbCollection);
      });
  });

  app.get('/api/collections/:id/items', function (req, res) {
    db.Item
      .findAll({ where: { CollectionId: req.params.id } })
      .then(function (dbItem) {
        res.json(dbItem);
      });
  });

  app.get('/api/collections', function (req, res) {
    db.Collection.findAll({}).then(function (dbCollections) {
      res.json(dbCollections);
    });
  });

  app.get('/api/collections/:id', function (req, res) {
    db.Collection.findById(req.params.id).then(function (dbCollection) {
      res.json(dbCollection);
    });
  });

  app.get('/api/items', function (req, res) {
    db.Item.findAll({}).then(function (dbItems) {
      res.json(dbItems);
    });
  });

  app.get('/api/items/:id', function (req, res) {
    db.Item.findById(req.params.id).then(function (dbItem) {
      res.json(dbItem);
    });
  });

  app.get('/api/opportunities', function (req, res) {
    db.Opportunity.findAll({}).then(function (dbOp) {
      res.json(dbOp);
    });
  });

  app.get('/api/opportunities/:id', function (req, res) {
    db.Opportunity.findById(req.params.id).then(function (dbOp) {
      res.json(dbOp);
    });
  });

  app.get('/api/opportunities/:id/applicants', function (req, res) {
    db.Collection.findAll({
      where: { OpportunityId: req.params.id },
      include: [{
        model: db.User,
        attributes: ['id', 'name']
      }]
    }).then(dbCollection => {
      let userNames = dbCollection.map(function (collection) {
        if (collection.User) {
          return { id: collection.User.id, name: collection.User.name };
        } else {
          return null;
        }
      });
      res.json(userNames);
    });
  });

  /************************\
  |  AUTHENTICATED ROUTES  |
  \************************/
  // DONE: Ensure POST routes use req.user object to set UserId where needed
  // TODO: Protect PUT routes so that only the owner of an item/collection can update it (or admin)
  // TODO: Protect DELETE routes so that only owner or admin can delete items/collections
  // TODO: (low priority) Make admin bypass for POST routes so they can mae stuff on account of other users

  app.get('/api/users/me', auth.isLoggedIn, function (req, res) {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      permissions: req.user.permissions
    });
  });

  app.get('/api/users/:id', auth.isLoggedIn, function (req, res) {
    if (req.user.id === req.params.id || req.user.permissions === 'admin') {
      db.User.findById(req.params.id).then(function (dbUser) {
        res.json(dbUser);
      });
    } else {
      res.status(403).send('You do not have permission to get this resource');
    }
  });

  app.post('/api/collections', auth.isLoggedIn, function (req, res) {
    // expects an object with properties 'name', 'description', 'UserId'
    // we can set 'UserId' with req.user.id to ensure it's created correctly.
    req.body.UserId = req.user.id;
    db.Collection.create(req.body).then(function (dbCollection) {
      res.json(dbCollection);
    });
  });


  // this tries to only allow for a user to delete their own collection (unless admin)
  app.delete('/api/collection/:id', auth.isLoggedIn, function (req, res) {
    let conditions = { where: { id: req.params.id } };

    if (!req.params.permissions === 'admin') {
      conditions.where.UserId = req.user.id;
    }

    db.Collection.destroy(conditions).then(function (dbCollection) {
      res.json(dbCollection);
    });
  });

  app.put('/api/collections/:id', auth.isLoggedIn, function (req, res) {
    // expects an object with properties 'name', 'description', 'UserId'
    // TODO: Add validation to ensure req.body has proper structure
    // TODO: We probably also want to prevent people assigning whatever they want in the object.
    // --- that would allow you to assign a collection to someone else.
    db.Collection.update(req.body, { where: { id: req.params.id } }).then(function (dbCollection) {
      res.json(dbCollection);
    });
  });

  app.put('/api/collections/:id/apply/:opID', auth.isLoggedIn, function (req, res) {
    db.Collection
      .update({ OpportunityId: req.params.opID }, { where: { id: req.params.id } })
      .then(dbCollection => res.json(dbCollection));
  });

  app.post('/api/items', auth.isLoggedIn, function (req, res) {
    // expects an object with properties 'name', 'imageUrl', 'description', 'UserId', 'CollectionId'
    // we can set 'UserId' with req.user.id to ensure it's created correctly.
    req.body.UserId = req.user.id;
    db.Item.create(req.body).then(function (dbItem) {
      res.json(dbItem);
    });
  });

  app.delete('/api/items/:id', auth.isLoggedIn, function (req, res) {
    db.Item.destroy({ where: { id: req.params.id } }).then(function (dbItem) {
      res.json(dbItem);
    });
  });

  app.put('/api/items/:id', auth.isLoggedIn, function (req, res) {
    // TODO: Add validation to ensure req.body has proper structure
    db.Item.update(req.body, { where: { id: req.params.id } }).then(function (dbItem) {
      res.json(dbItem);
    });
  });


  /*********************\
  |  ADMIN ONLY ROUTES  |
  \*********************/

  // just to check admin stuff.
  app.get('/admin', auth.isAdmin, function (req, res) {
    res.send('yes');
  });

  app.get('/api/users', auth.isAdmin, function (req, res) {
    db.User.findAll({}).then(function (data) {
      res.json(data);
    });
  });


  app.post('/api/users', auth.isAdmin, function (req, res) {
    // expects an object with properties 'name', 'email', 'bio'
    db.User.create(req.body).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  app.delete('/api/users/:id', auth.isAdmin, function (req, res) {
    db.User.destroy({ where: { id: req.params.id } }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  app.put('/api/users/:id', auth.isAdmin, function (req, res) {
    db.User.update(req.body, { where: { id: req.params.id } }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  app.post('/api/opportunities', auth.isAdmin, function (req, res) {
    // expects an object with properties 'name', 'description', 'category', 'deadline' (date)
    // TODO: Add validation to ensure req.body has proper structure
    // we can set 'UserId' with req.user.id to ensure it's created correctly.
    req.body.UserId = req.user.id;
    db.Opportunity.create(req.body).then(function (dbOp) {
      res.json(dbOp);
    });
  });

  app.delete('/api/opportunities/:id', auth.isAdmin, function (req, res) {
    db.Opportunity.destroy({ where: { id: req.params.id } }).then(function (dbOp) {
      res.json(dbOp);
    });
  });

  app.put('/api/opportunities/:id', auth.isAdmin, function (req, res) {
    // TODO: Add validation to ensure req.body has proper structure
    db.Opportunity.update(req.body, { where: { id: req.params.id } }).then(function (dbOpportunity) {
      res.json(dbOpportunity);
    });
  });

};
