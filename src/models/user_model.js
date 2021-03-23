const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    ad:{
        type:String,
        trim:true
    },
    soyad:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        lowercase:true,
        trim:true,
        unique:true
    },
    pass:{
        type:String,
        trim:true
    },
    aktif:{
        type:Boolean,
        default:false
    },
    avatar:{
        type:String,
        default:'default.png'
    },
    authGoogle:{
        type:Boolean
    },
    authFacebook:{
        type:Boolean
    }
    
},{timestamps:true})

const User = mongoose.model('user',UserSchema);

module.exports = User