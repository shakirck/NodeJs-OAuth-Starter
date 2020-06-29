const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const app = express();
const mongoose = require('mongoose');
const db = require('./config/mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const customMiddleWare = require('./config/middleware');
const PORT = 8000;
const oAuthPassportStrategies = require('./config/passport-oAuth2-strategy');
const sassMiddleWare = require('node-sass-middleware');
//for sass middleware
app.use(sassMiddleWare({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle:'extended',
    prefix:'/css'
}));
 app.use(expressLayouts);
app.set('view engine','ejs');
app.use(express.urlencoded({useNewUrlParser:true}));
app.use(express.static('assets'));
app.set('layout extractStyles',true);
app.set("layout extractScripts", true)




//For saving session 
app.use(session({
    name:'authTest',
    secret:'mykey',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    }
 

}));
//passport authentication middlewares
app.use(passport.initialize())
app.use(passport.session());
app.use(passport.setAuthenticatedUser);


//flash
app.use(flash());
app.use(customMiddleWare.setFlash);

app.use('/',require('./routes'));
app.use('/users',require('./routes/users'));





//running server
app.listen(PORT,console.log('Server Started on ', PORT));