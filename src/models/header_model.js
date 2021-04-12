const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const HeaderSettingsSchema = new Schema({
    headerSettingAd:{
        type:String,
        trim:true
    },
    headerSettingDesc:{
        type:String,
        trim:true
    },
    headerSettingLink:{
        type:String,
        trim:true
    }
    
})

const HeaderSettings = mongoose.model('headersetting',HeaderSettingsSchema);

module.exports = HeaderSettings