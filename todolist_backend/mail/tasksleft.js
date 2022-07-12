let cron = require('node-cron');
  let nodemailer = require('nodemailer');
  const config = require("../config/auth.config");
  const axios = require('axios');

const user = config.user;
const pass = config.pass;

  // e-mail message options
//   console.log("out");

 cron.schedule("0 20 17 * * * ", () => {
    //  console.log("inside cron");
    // Send e-mail
    // let mailOptions = {
    //     from: user,
    //     to: '<TO_EMAIL_ADDRESS>',
    //     subject: 'Email from Node-App: A Test Message!',
    //     text: 'Some content to send'
    // };

    // e-mail transport configuration
    let userdetails;
    axios
  .get('http://localhost:3000/api/users')
  .then(res => {
    userdetails = res;
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
  for(const userprofile in userdetails){
    let tasks;
    axios
        .get('http://localhost:3000/api/todos/'+ userprofile.userID)
        .then(res => {
            tasks = res;
            console.log(res);
        })
        .catch(error => {
            console.error(error);
        });
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: user,
        pass: pass,
        }
    });
    transporter.sendMail({
        from: user,
        to: userprofile.email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
            <h2>Hello</h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            <div>
            <p>${tasks}</p>
            </div
            
            `,
      }).catch(err => console.log(err));
  }

    
  });