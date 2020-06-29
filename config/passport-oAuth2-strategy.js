const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/User');
const oAuthFunctions = require('./oauthFunctions');
const facebookStrategy = require('passport-facebook').Strategy;
const keys = require('./keys');

//for using google OAuth
passport.use(new googleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: 'http://localhost:8000/users/auth/google/callback'
},
 oAuthFunctions.registerOfLogin
));

//for using Facebook Oauth
passport.use(new facebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: 'http://localhost:8000/users/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name','displayName'] 
  },
  oAuthFunctions.registerOfLogin
));
module.exports = passport;