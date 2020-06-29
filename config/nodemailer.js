const nodemailer = require('nodemailer');
const keys = require('./keys');
const ejs = require('ejs');
const path = require('path');
const { relative } = require('path');


//setting up a transporter for sending the email 
let transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:keys.gmail.user,//user name and password for sender email
        pass:keys.gmail.pass
    }
})


// setting up rendering a ejs file for sending as mail
let renderTemplate = (data,relativePath)=>{
    let mailHtml;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){console.log('error while rendering the email template',err);return}
            mailHtml =template;

        }


    )
    return mailHtml;
}
module.exports = {
    transporter,
    renderTemplate
}