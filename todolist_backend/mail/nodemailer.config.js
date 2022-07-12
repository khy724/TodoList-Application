const nodemailer = require("nodemailer");
const config = require("../config/auth.config");
const AWS = require('aws-sdk');
const user = config.user;
const pass = config.pass;
const SES = new AWS.SES();
const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});


module.exports.sendConfirmationEmail = (email) => {
    
    SES.sendEmail({
      Source: user,
      Destination: { ToAddresses: [email]},
      Message: {
        Subject: {
          Data: `Please confirm your account`
        },
        Body: {
          Html: {
            Data: `<h1>Email Confirmation</h1>
            <h2>Hello</h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            
            `
          }
        }
      }
      
     
    },function(err,data){
      if(err)console.log(err);
    });
  };