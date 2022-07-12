const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const {Todo} = require('../models/todo');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const nodemailer = require('../mail/nodemailer.config');
const conf = require("../config/auth.config");
let cron = require('node-cron');
  let nodemail = require('nodemailer');
 
  const axios = require('axios');
let refreshtokens = [];
if (mongoose.models.User) {
  delete mongoose.models.User
}
if (mongoose.models.Todo) {
  delete mongoose.models.Todo
}
router.get('/me', auth, async (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://demo---deploy.s3-website.ap-south-1.amazonaws.com');
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.get('/', auth, async (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://demo---deploy.s3-website.ap-south-1.amazonaws.com');
  console.log("req rec");
  // const users = await User.find();
  // res.send(users);
});

router.post("/renewAT",(req,res)=>{
  res.set('Access-Control-Allow-Origin', 'http://demo---deploy.s3-website.ap-south-1.amazonaws.com');
    const refreshtoken = req.body.refreshtoken;
    console.log(refreshtoken);
    if(!refreshtoken ){//|| !refreshtokens.includes(refreshtoken)
      return res.status(403).json({message:"User not authenticated"});
    }
    jwt.verify(refreshtoken,config.get('jwtPrivateRefreshKey'),(err, user)=>{
        if(!err) {
            console.log("sending access token")
            const accesstoken=new User(_.pick(user,[ 'email', 'password'])).generateAuthAccessToken();
            res.status(201).send({"accesstoken":accesstoken});
        }
        else{
          console.log("refresh key expired")
          return res.status(403).json({message:"User not authenticated"});
        }
    });
})


router.post('/login', async (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://demo---deploy.s3-website.ap-south-1.amazonaws.com');
  // console.log(req.body);
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  console.log(res)
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const accesstoken = user.generateAuthAccessToken();
  // console.log(accesstoken);
          const refreshtoken = user.generateAuthRefreshToken();
          // refreshtokens.push(refreshtoken);
          const l = {
            "_id":user._id,
            "email":user.email,
            "password":user.password,
            "accesstoken": accesstoken,
            "refreshtoken": refreshtoken,
          }
          console.log(l);
          res.header('x-access-token', accesstoken).send(l);
  // console.log(token);
  // res.header('x-auth-token', token).send(_.pick(user, ['_id','email']));
});

// function validatelogin(req) {
//   const schema = Joi.object({
//     email: Joi.string().min(5).max(255).required().email(),
//     password: Joi.string().min(5).max(255).required()
//   });

//   return schema.validate(req);
// }


router.post('/', async (req, res) => {
  // console.log("sakgb");
  res.set('Access-Control-Allow-Origin', 'http://demo---deploy.s3-website.ap-south-1.amazonaws.com');
  console.log("inside signup");
  
  const { error } = validate(req.body); 
  
  if (error) {
    // console.log("jgv");
    return res.status(400).send(error.details[0].message);
  }
  
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');
  
  user = new User(_.pick(req.body, [ 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  
  
  await user.save((err) => {
    if (err) {
      res.status(500).send({ message: err });
           return;
        }
     else{
          const accesstoken = user.generateAuthAccessToken();
          const refreshtoken = user.generateAuthRefreshToken();
          // refreshtokens.push(refreshtoken);
          res.header('x-auth-token', accesstoken).send({
            "_id":user._id,
            "email":user.email,
            "password":user.password,
            "accesstoken": accesstoken,
            "refreshtoken": refreshtoken,
          });
          console.log("in us save");
           nodemailer.sendConfirmationEmail(user.email);
     }   
       
});
  

  
});

  const user = conf.user;
  const pass = conf.pass;

  // e-mail message options
  //   console.log("out");

 cron.schedule("0 05 15 * * * ", async function(){
    console.log("inside cron");
    let userdetails= await User.find();
    // console.log(userdetails);
  // let userdetails=["lkhgk","gvgjm","hfcjhg"];
  userdetails.forEach(async function(userprofile,index){
    // console.log("int");
    // console.log(userprofile.email);
    // console.log(userprofile.userID);
    var today = new Date();
    var datte = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let tasks= await Todo.find({date: datte.toLocaleString(),completed:false,userID:userprofile._id});
    // console.log(tasks);
    let message = (
      '<table style="border: 1px solid #333;">' +
      '<thead>' +
      '<th> Tasks </th>' +
      '</thead>'
    ); 
    
    for(const { content } of tasks) {
      message += (
        '<tr>' +
         '<td>' + content + '</td>' +
         
       '</tr>'
      );
   }
   message +=  '</table>';
    const transporter = nodemail.createTransport({
      service: "Gmail",
      auth: {
        user: user,
        pass: pass,
      },
    });
    console.log(tasks);
    transporter.sendMail({
        from: user,
        to: userprofile.email,
        subject: "Pending Tasks for the day",
        html: message,
      }).catch(err => console.log(err));
  });

    
  
});
module.exports = router; 