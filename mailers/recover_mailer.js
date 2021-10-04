const nodeMailer = require('../config/nodemailer');


 //sending a recover mail to the user's registerd email id 
exports.recoverUser= (user)=>{
    // getting the html template from the ejs template
    let htmlString =  nodeMailer.renderTemplate({user:user},'recover_account.ejs');
    
    // console.log('inside mailer ',user);
    //sending the email to the user
    nodeMailer.transporter.sendMail({
        from: 'shakirckyt@gmail.com', // sender address
        to: user.email, // list of receivers
        subject: "PASSWORD RESET", // Subject line
        // text: "Hello world?", // plain text body
        html:htmlString, // html body   

    },function(err,info){
        if(err){console.log('error while sending mail',err);return;}
         console.log('email send',info,)
    });
    return;
};