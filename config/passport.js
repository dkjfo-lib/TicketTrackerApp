const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const { deleteOne } = require("../models/User");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, cb) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value
        }
        try {
          let user = await User.findOne({googleId: profile.id})
          if (user){
            // user was found => callBack(err: null, data: user)
            cb(null, user)
          }else{
            // user was not found => add new User and callBack
            user = await User.create(newUser)
            cb(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  );

  passport.serializeUser((user, cb) => {
    process.nextTick(() => {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });
  
  passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
      return cb(null, user);
    });
  });
};


