const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BultenEmailSchema = new Schema({
    bultenEmail:{
        type:String,
        trim:true
    }
})

const BultenEmailModel = mongoose.model('bultenemail',BultenEmailSchema);

module.exports = BultenEmailModel