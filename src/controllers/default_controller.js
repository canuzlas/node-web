const HeaderSettings = require('../models/header_model');
const SliderSettings = require('../models/slider_model');

const showIndexPage = async(req,res) => {
    
    const settings = await HeaderSettings.find();
    const logo = await settings.filter(setting => {
        if(setting.headerSettingAd == "logo"){
            return setting.headerSettingLink
        }
    })
    const sliders = await SliderSettings.find();
    res.render("default/index.ejs",{layout: "defaultLayout/default_layout.ejs",uye:req.user, settings:settings,logo:logo, sliders:sliders})
}

module.exports = {
    showIndexPage 
}