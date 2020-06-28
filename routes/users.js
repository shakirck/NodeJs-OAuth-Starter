const express = require("express");
const router = express.Router();
const passport = require("passport");
const usersController = require("../controllers/users_controller");
router.get("/login",usersController.login);
router.get("/register", usersController.register);
router.get('/profile',passport.checkAuthentication,usersController.profile);
//register
 
router.post("/create-session", usersController.createSession);
router.post("/login",passport.authenticate("local", { failureRedirect: "/users/login" }),
  usersController.profile
);
router.post('/update/:id',usersController.update);
router.get('/logout',usersController.logout);
router.get('/reset-password/:id', passport.checkAuthentication,usersController.passwordReset);

router.post('/change-password/:id',passport.checkAuthentication,usersController.changePassword);
//google
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/login'}),usersController.createSessionAuth);
//facebook
router.get('/auth/facebook',passport.authenticate('facebook'));
router.get('/auth/facebook/callback',passport.authenticate('facebook',{failureRedirect:'/users/login'}),usersController.createSessionAuth);


module.exports = router;
