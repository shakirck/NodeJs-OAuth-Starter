const User = require("../models/User");
const bcrypt = require("bcrypt");
const mailersVerify = require("../mailers/verification_mailer");
const mailerRecover = require("../mailers/recover_mailer");
const crypto = require("crypto");

//Creating  a session for users using Social Media auth
module.exports.createSessionAuth = async function (req, res) {
  //checking if a user is already present having same email id
  const user = await User.findOne({ email: req.user.email });
  //if already a user is present then login the user
  if (user) {
    return res.redirect("/users/login");
  } else {
    //if user is not present , create a new user with the details got from  OAuth
    User.create(req.user, function (err, user) {
      if (err) {
        console.log(error);
        return res.redirect("/");
      }

      console.log(user);
      return res.redirect("/users/login");
    });
  }
};

//Creating session for local users
module.exports.createSession = async function (req, res) {
  try {
    //checking if the terms and condition is checked or not
    if (req.body.termsandconditions == undefined) {
      req.flash("error", "You don't agree with our terms and condition");

      return res.redirect("back");
    }
    //checking password match
    if (req.body.password !== req.body.confirm_password) {
      req.flash("error", "Passwords Donot Match");

      return res.redirect("back");
    }

    //password validation
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!req.body.password.match(passw)) {
      req.flash("error", "Password format incorrect");
      req.flash("error", "password legnth should be between 6 to 20");
      req.flash("error", "Should contain at least one numeric digit");
      req.flash(
        "error",
        "Should contain one uppercase and one lowercase letter"
      );

      return res.redirect("back");
    }

    //checking if a user is already  present or not
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      req.flash("error", "User already Registered.Try Logging in");

      return res.redirect("/users/register");
    }

    if (!user) {
      //create a new user with the form details
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("ERROR ");
          return;
        }
        //encrypting the password of the user using cryppto
        const saltRounds = 10;
        const verifyUserToken = crypto.randomBytes(20).toString("hex");
        user.verifyToken = verifyUserToken;

        //changing the password of the user to the encrypted password
        bcrypt.hash(user.password, saltRounds).then(function (hash) {
          user.password = hash;
          user.save();
        });

        req.flash(
          "success",
          "An Verification Mail has been send to your registerd email"
        );
        //TODO: Uncomment this following line
        console.log("user before sending the data to emailer", user);
        //sending the verify user mail to the registered mail id
        mailersVerify.verifyUser(user);
        return res.redirect("/users/login");
      });
    }
  } catch (error) {
    req.flash("error", err);
    console.log(error);
    return res.redirect("back");
  }
};

//for updating email and name
module.exports.update = async function (req, res) {
  // console.log(req.user);
  // console.log(req.user.id, req.user.name);
  // console.log(req.params.id);

  //checking the user is authoraized or not
  if (req.user.id === req.params.id) {
    const checkUser = await User.findOne({ email: req.body.email });
    if (checkUser) {
      req.flash("error", "Email already in Use");

      return res.redirect("back");
    } else {
      //changing the user details with the new data
      const user = await User.findById(req.user.id);
      user.name = req.body.name;
      user.email = req.body.email;
      user.save();
      req.flash("success", "Profile Details Changed Successfully");

      return res.redirect("back");
    }
  } else {
    console.log("false");
    req.flash("error", "Couldn't Update details");
  }
};

//for verifying the user
module.exports.verifyUser = async function (req, res) {
  // console.log(req.params);
  try {
    //getting the user with the id
    const user = await User.findById(req.params.id);

    if (user) {
      //checking if the token passed is correct or not by matching it with the token stored int the database
      if (req.params.token === user.verifyToken) {
        console.log("verified");
        //setting the user as a verified user
        user.verified = true;
        user.save();
        req.flash("success", "User verified");
        return res.redirect("/users/login");
      } else {
        req.flash("error", "verification failed");
        console.log("unverified");
      }
    }
  } catch (error) {
    req.flash("error", "Verification Failed");
    return res.redirect("/");
  }
};

// for changing the user password
module.exports.changePassword = async function (req, res) {
  const user = await User.findById(req.params.id);
  // generating the encrypted password of the user and saving it to the database
  bcrypt.hash(req.body.password, 10).then(function (hash) {
    user.password = hash;
    user.forgotToken = -1;
    user.save();
    req.flash("success", "Password Changed Successfully");
    return res.redirect("/users/profile");
  });
};

module.exports.verify = function (req, res) {
  // if(req.params.token)
  console.log(req.params.token);
};

// for rendering the password reset page
module.exports.passwordReset = function (req, res) {
  if (req.user.id === req.params.id) {
    return res.render("pass-reset");
  }
  return res.redirect("/");
};

//rendering profile page
module.exports.profile = function (req, res) {
  // console.log("verified", req.user.verified);

  res.render("profile", {
    user: req.user,
  });
};

//Logging out the user
module.exports.logout = function (req, res) {
  req.logout();
  req.flash("success", "Logged Out Successfully");
  return res.redirect("/");
};

//loading the register page
module.exports.register = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("register");
};

// rendering the login page
module.exports.login = function (req, res) {
  // console.log( message )
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("login");
};

//rendering the forgot password page
module.exports.renderForgotPassword = function (req, res) {
  res.render("forgot-password");
};

//recover account
module.exports.recoverEmail = async function (req, res) {
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error", "Couldn't find't the user you are looking for");
      res.redirect("back");
    }
    //generating the token from the dateobject
    user.forgotToken = Date.now();
    user.password = user.forgotToken;
    user.save();
    //send recover email
    mailerRecover.recoverUser(user);
    req.flash("success", "Check Your registered Email");
    return res.redirect("/users/login");
  } catch (error) {
    console.log("err while recovering account", error);
  }
};
