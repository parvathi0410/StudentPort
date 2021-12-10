
//Passport strategy for Google OAuth 2.0
//Just copy the following piece from http://www.passportjs.org/ 


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

//Create google credentials
//Client ID and Client secret
//https://console.cloud.google.com/apis/credentials?project=lucky-cosine-334110

const GOOGLE_CLIENT_ID ='227599018896-ctvfm99pevt4jg5hglgq2bu333ijg1m6.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET ='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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
    passReqToCallback: true
  },

  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }));


//If authentication succeeds, a session will be established 

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });