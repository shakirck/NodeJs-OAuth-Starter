const User = require('../models/User');
const crypto = require('crypto');

//for creating a user in the database when users login using the Oauth functions
module.exports.registerOfLogin = function(accessToken, refreshToken, profile, done) {
    //checking if the user is alrady present or not
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err){
            console.log('error in oAuthGoogle',err);
            return;
        }
        // console.log(profile);
        if(user){
            return done(null,user);
        }else{
            //creating a ne wuser if user is not present
            User.create({
                name : profile.displayName,
                email:profile.emails[0].value,
                password : crypto.randomBytes(20).toString('hex'),
                verified:true
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