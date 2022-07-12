const { string } = require('joi');
const Joi=require('joi');
const mongoose=require('mongoose');
mongoose.Promise = global.Promise;
const todoSchema = new mongoose.Schema({
    userID:{
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    completed:{
        type: Boolean,
        default : false,
    } ,
    date:{
        type: String,
    }

});

exports.Todo = mongoose.model.Todo || mongoose.model('Todo',todoSchema);