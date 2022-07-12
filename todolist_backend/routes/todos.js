const {Todo} = require('../models/todo');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const auth = require('../middleware/auth');
if (mongoose.models.Todo) {
  delete mongoose.models.Todo
}
if (mongoose.models.User) {
  delete mongoose.models.User
}
router.get('/:id',auth, async (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://demo---deploy.s3-website.ap-south-1.amazonaws.com');
    // console.log(req.params.id);'
    console.log("get todos");
    const todos = await Todo.find({userID: req.params.id});
    // console.log(todos);
    res.send(todos);
  });

  router.post('/',auth, async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://demo---deploy.s3-website.ap-south-1.amazonaws.com');
    // const { error } = validate(req.body); 
    // if (error) return res.status(400).send(error.details[0].message);
    // console.log(req.body);
    const user = await User.find({userID: req.body.userID});
    if (!user) return res.status(400).send('Invalid user.');
    var today = new Date();
    var datte = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    
    const todo = new Todo({ 
      userID: req.body.userID,
      content: req.body.content,
      completed: false,
      date: datte.toLocaleString(),
    });
    await todo.save();
    
    res.send(todo);
  });
  
  router.put('/:id',auth, async (req, res) => {
    // const { error } = validate(req.body); 
    // if (error) return res.status(400).send(error.details[0].message);
    res.set('Access-Control-Allow-Origin', 'http://demo---deploy.s3-website.ap-south-1.amazonaws.com');
    const user = await User.find({userID: req.body.userID});
    if (!user) return res.status(400).send('Invalid user.');
  
    const todo = await Todo.findByIdAndUpdate(req.params.id,
      { 
        content: req.body.content,
        user: req.body.user,
        completed: req.body.completed,
      }, { new: true });
  
    if (!todo) return res.status(404).send('The todo with the given ID was not found.');
    // console.log(todo);
    res.send(todo);
  });
  
  router.delete('/:id',auth, async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://demo---deploy.s3-website.ap-south-1.amazonaws.com');
    const todo = await Todo.findByIdAndRemove(req.params.id);
  
    if (!todo) return res.status(404).send('The todo with the given ID was not found.');
  
    res.send(todo);
  });
  
  // router.get('/:id', async (req, res) => {
  //   const todo = await Todo.findById(req.params.id);
  
  //   if (!todo) return res.status(404).send('The todo with the given ID was not found.');
  
  //   res.send(todo);
  // });
  
  module.exports = router;