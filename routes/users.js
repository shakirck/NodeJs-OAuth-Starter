const express = require("express");
const router = express.Router();
const passport = require("passport");
const usersController = require("../controllers/users_controller");


router.get("/login",usersController.login);// login page 
router.get("/register", usersController.register);//register page
router.get('/profile',passport.checkAuthentication,usersController.profile);//loading the profile page if and only if authentication is successfull

//register
router.post("/create-session", usersController.createSession); //creating a new user profile

//authenticating the user for logging in
router.post("/login",passport.authenticate("local", { failureRedirect: "/users/login" ,failureFlash : true}),
  usersController.profile
);


router.post('/update/:id',usersController.update); //updating the user details
router.get('/logout',usersController.logout); //loggout the user

router.get('/verify-user/:token/:id',usersController.verifyUser);//verify the user
router.post('/recover',usersController.recoverEmail);//generate and send recover email
router.get('/forgot-password',usersController.renderForgotPassword);//rendering the forgot password page



router.get('/reset-password/:id', passport.checkAuthentication,usersController.passwordReset); //resetiing the password
//change password route
router.post('/change-password/:id',passport.checkAuthentication,usersController.changePassword);



//OAuth ROutes
//google
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/login'}),usersController.createSessionAuth);
//facebook
router.get('/auth/facebook',passport.authenticate('facebook'));
router.get('/auth/facebook/callback',passport.authenticate('facebook',{failureRedirect:'/users/login'}),usersController.createSessionAuth);


module.exports = router;
