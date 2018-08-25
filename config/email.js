passport.use('local-signup', new LocalStrategy(

    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback

    },

    function (req, email, password, done) {
      var generateHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };

      User.findOne({ where: { email: email } })
        .then(dbUser => {
          if (dbUser) {
            return done(null, false, { message: 'That username is already taken.' });
          } else {
            let userPassword = generateHash(password);
            let data = {
              email: email,
              password: userPassword,
              name: req.body.name,
              bio: req.body.bio
            };

            User.create(data).then((newUser /*, created */) => {
              if (!newUser) {
                return done(null, false);
              }

              if (newUser) {
                return done(null, newUser);
              }
            });
          }
        });
    }