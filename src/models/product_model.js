const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ProductSchema = new Schema({
    urunAd:{
        type:String,
        trim:true
    },
    urunFiyat:{
        type:String,
        trim:true
    },
    urunAciklama:{
        type:String,
        trim:true
    },
    urunStok:{
        type:Number,
        trim:true
    },
    urunOneCikar:{
        type:Boolean,
        default:false
    },
    urunFoto:{
        type:String
    },
    urunKategori:{
        type:String
    }
    
},{timestamps:true})

const Product = mongoose.model('product',ProductSchema);

module.exports = Product