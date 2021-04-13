const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SliderSettingsSchema = new Schema({
    sliderBaslik:{
        type:String,
        trim:true
    },
    sliderDesc:{
        type:String,
        trim:true
    },
    sliderLink:{
        type:String,
        trim:true
    },
    sliderFoto:{
        type:String,
        trim:true
    }
})

const SliderSettings = mongoose.model('slidersetting',SliderSettingsSchema);

module.exports = SliderSettings