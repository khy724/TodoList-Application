const config = require('config');
// const { string } = require('joi');
const Joi=require('joi');
const mongoose=require('mongoose');
const jwt = require('jsonwebtoken');
mongoose.Promise = global.Promise;
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
      },
    password:{
        type: String,
        required: true,
        minlength:5,
        maxlength:1024,

    },
    
    isAdmin: Boolean
});



userSchema.methods.generateAuthAccessToken = function() { 
    console.log(1);
    const token = jwt.sign(this.toJSON(), config.get('jwtPrivateAccessKey'),{expiresIn: '3600s'});
    console.log(2);
    return token;
  }
  userSchema.methods.generateAuthRefreshToken = function() { 
    console.log(1);
    const token = jwt.sign(this.toJSON(), config.get('jwtPrivateRefreshKey'),{expiresIn: '1440m'});
    console.log(2);
    return token;
  }
  

function validateUser(user){
    const schema=Joi.object({
        
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    // console.log(user);
    return schema.validate(user);

}

exports.User = mongoose.model.User || mongoose.model('User', userSchema);; 
exports.validate = validateUser;