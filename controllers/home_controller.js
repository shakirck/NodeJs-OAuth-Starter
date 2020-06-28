module.exports.welcome = function(req,res){
   if(req.isAuthenticated()){
    return res.redirect('users/login');
   }
   return res.render('welcome');
}