const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CategorySettingsSchema = new Schema({
    categoryAd:{
        type:String,
        trim:true
    },
    categoryLink:{
        type:String,
        trim:true
    }
})

const CategorySettings = mongoose.model('categorye',CategorySettingsSchema);

module.exports = CategorySettings