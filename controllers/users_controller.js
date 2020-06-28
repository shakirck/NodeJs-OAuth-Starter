const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports.createSessionAuth = async function(req,res){
  const user = await User.findOne({email: req.user.email});
  if(user){
    return res.redirect('/users/login');
  }
  else{
    User.create(req.user,function(err,user){
     if(err){console.log(error); return res.redirect('/')}

     console.log(user);
     return res.redirect('/users/login');
    });
    
  }
}
module.exports.createSession = async function (req, res) {
  
  try {
    if (req.body.password !== req.body.confirm_password) {
      req.flash("error", "Passwords Donot Match");

      return res.redirect("back");
    }

    const user = await User.findOne({ email: req.body.email });

    if (user) {
      req.flash("error", "User already Registered.Try Logging in");

      return res.redirect("/users/register");
    }
    if(!user){
      User.create(req.body,function(err,user){
        if(err){console.log('ERROR ');return}
         const saltRounds = 10;
        bcrypt.hash(user.password, saltRounds).then(function (hash) {
          user.password = hash;
          user.save();
        });
        req.flash("success", "Registration Completed!!Login Now");
    
        return res.redirect('/users/login');
       });
    }
    
    
  } catch (error) {
    req.flash("error", err);
    console.log(error);
    return res.redirect("back");
  }
};

module.exports.update = async function (req, res) {
  console.log(req.user);
  console.log(req.user.id, req.user.name);
  console.log(req.params.id);

  if (req.user.id === req.params.id) {
    const checkUser = await User.findOne({email:req.body.email});
    if(checkUser){
      req.flash('error','Email already in Use');

      return res.redirect("back");
    }
    else{
      const user = await User.findById(req.user.id);
    user.name = req.body.name;
    user.email = req.body.email;
    user.save();
    req.flash('success','Profile Details Changed Successfully');

    return res.redirect("back");
    }
  } else {
    console.log("false");
    req.flash('error','Couldn\'t Update details');

  }
};
module.exports.changePassword = async function(req,res){
  const user = await User.findById(req.params.id);
  bcrypt.hash(req.body.password, 10).then(function (hash) {
    user.password = hash;
    user.save();
    req.flash('success','Password Changed Successfully');
    return res.redirect('/users/profile');
  });
}
module.exports.passwordReset = function(req,res){
    if(req.user.id === req.params.id){
      return res.render('pass-reset');
    }
    return res.redirect('/')
}
module.exports.profile = function (req, res) {
  res.render("profile", {
    user: req.user,
  });
};
module.exports.logout = function (req, res) {
  req.logout();
  req.flash("success", "Logged Out Successfully");
  return res.redirect("/");
};
module.exports.register = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("register");
};
module.exports.login = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("login");
};
