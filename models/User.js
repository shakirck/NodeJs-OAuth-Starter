const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    verified:{
        type:Boolean,
        default:false
    },
    verifyToken:{
        type:String
    },
    forgotToken:{
        type:Number
    }
});
const User = mongoose.model('User',UserSchema);
module.exports = User;