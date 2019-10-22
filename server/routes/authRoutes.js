const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/facebook', passport.authenticate('facebook',{scope:'email'}))

router.get('/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', (req, res) => {
  res.status(200).json({});
})

module.exports = router
