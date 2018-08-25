
module.exports = function (app, passport) {

  app.post('/register', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/register'
  }));
<<<<<<< HEAD
  app.post('/changepass', passport.authenticate('local-changepass', {
    successRedirect: '/login',
    failureRedirect: '/changepass'
  }));
=======
>>>>>>> da84f94328b286460091d8ead750da13aa9f4e37

  app.post('/login', passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

<<<<<<< HEAD
};
=======
};
>>>>>>> da84f94328b286460091d8ead750da13aa9f4e37
