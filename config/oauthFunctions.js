const User = require('../models/User');
const crypto = require('crypto');
module.exports.registerOfLogin = function(accessToken, refreshToken, profile, done) {
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err){
            console.log('error in oAuthGoogle',err);
            return;
        }
        console.log(profile);
        if(user){
            return done(null,user);
        }else{
            User.create({
                name : profile.displayName,
                email:profile.emails[0].value,
                password : crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err){
                    console.log('error while creating a user');
                    return;
                }
                console.log(user);
                return done(null,user);
            })
        }
    });
  }