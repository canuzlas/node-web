const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const IyzicoSchema = new Schema({
    conversationId:{
        type:String,
        trim:true
    },
    token:{
        type:String,
        trim:true
    }
})

const IyzicoModel = mongoose.model('iyzicocallback',IyzicoSchema);

module.exports = IyzicoModel