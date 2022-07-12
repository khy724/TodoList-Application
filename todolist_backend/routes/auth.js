const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  // console.log(req.body);
  res.set('Access-Control-Allow-Origin', 'http://demo---deploy.s3-website.ap-south-1.amazonaws.com');
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const accesstoken = user.generateAuthAccessToken();
          const refreshtoken = user.generateAuthRefreshToken();
          res.header('x-auth-token', accesstoken).send({
            "_id":user._id,
            "email":user.email,
            "accesstoken": accesstoken,
            "refreshtoken": refreshtoken,
          });
  // console.log(token);
  // res.header('x-auth-token', token).send(_.pick(user, ['_id','email']));
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(req);
}

module.exports = router; 