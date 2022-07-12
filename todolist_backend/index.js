const config = require('config');
const express = require('express');
const app = express();
const users = require('./routes/users');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');

const todos = require('./routes/todos');
const cors=require('cors');


const dbURL = config.get('mongodb_atlas_url');
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

if (!config.get('jwtPrivateAccessKey')){
  // console.log(config.get('jwtPrivateKey'));
  console.error('FATAL ERROR: jwt accesskey not defined!');
  process.exit(1);
}
if (!config.get('jwtPrivateRefreshKey')){
  // console.log(config.get('jwtPrivateKey'));
  console.error('FATAL ERROR: jwt refreshkey not defined!');
  process.exit(1);
}


  mongoose.connect(dbURL,connectionParams)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error(err));

app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // keep this if your api accepts cross-origin requests
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
  next();
});
app.use(cors());
// app.use('/api/todos',todos);
console.log("index.js")
app.use('/api/users',users);

app.use('/api/todos',todos);

module.exports = app;
