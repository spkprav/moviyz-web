const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const session = require('express-session')
const facebookConfig = require('./config/facebook')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const apiRoutes = require('./server/routes/apiRoutes.js')
const authRoutes = require('./server/routes/authRoutes.js')

// Use the FacebookStrategy within Passport.

passport.use(new FacebookStrategy({
    clientID: facebookConfig.facebook_api_key,
    clientSecret: facebookConfig.facebook_api_secret,
    callbackURL: facebookConfig.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      // if(config.use_database) {
      //   // if sets to true
      //   pool.query("SELECT * from user_info where user_id="+profile.id, (err,rows) => {
      //     if(err) throw err;
      //     if(rows && rows.length === 0) {
      //         console.log("There is no such user, adding now");
      //         pool.query("INSERT into user_info(user_id,user_name) VALUES('"+profile.id+"','"+profile.username+"')");
      //     } else {
      //         console.log("User already exists in database");
      //     }
      //   });
      // }
      return done(null, profile);
    });
  }
));

app.prepare()
.then(() => {
  const server = express()

  server.use(bodyParser.json());
  server.use(passport.initialize());
  server.use(passport.session());

  server.use('/api', apiRoutes);
  server.use('/auth', authRoutes);

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
