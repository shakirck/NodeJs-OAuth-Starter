const nodeMailer = require("../config/nodemailer");

//for sending the verification mail to the user
exports.verifyUser = (user) => {
  let htmlString = nodeMailer.renderTemplate({ user: user }, "verify_mail.ejs");

  console.log("checking user verification");
  console.log(user);
  nodeMailer.transporter.sendMail(
    {
      from: "shakirckyt@gmail.com", // sender address
      to: user.email, // list of receivers
      subject: "VERIFIY YOUR EMAIL ✔", // Subject line
      // text: "Hello world?", // plain text body
      html: htmlString, // html body
    },
    function (err, info) {
      if (err) {
        console.log("error while sending mail", err);
        return;
      }
      console.log("email send", info);
    }
  );
  return;
};
