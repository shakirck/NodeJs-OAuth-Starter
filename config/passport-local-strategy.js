const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose  = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true,
    },
    function(req,email,password,done){
        console.log(email,password);
        //find and establis the identity 
        User.findOne({email:email},function(err,user){
            if(err){
                req.flash('error',err);
                console.log('error in finding user');
                return done(err);
            }

            if(!user){
                req.flash('error','Invalid Username/Password');
                console.log('invalid username or password');
                return done(null,false);
            }
            console.log('password',password)
            console.log('User password',user.password)
             bcrypt.compare(password,user.password,function(err,match){
                 if(err){console.log('error while checking the password bcry')}
                if(match){
                    console.log('match found')
                    return done(null,user);
                }else{
                    console.log('match not found')

                    return done(null,false);
                }
            });
         });
    }
));
passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){console.log('error in finding user'); return;}
        return done(null,user);
    });
});

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();     
}

passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    //if user is not signed in
    return res.redirect('/users/login');
}
module.exports = passport