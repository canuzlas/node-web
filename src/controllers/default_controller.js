const HeaderSettings = require('../models/header_model');

const showIndexPage = async(req,res) => {
    
    const settings = await HeaderSettings.find();
    const logo = await settings.filter(setting => {
        if(setting.headerSettingAd == "logo"){
            return setting.headerSettingLink
        }
    })
    res.render("default/index.ejs",{layout: "defaultLayout/default_layout.ejs",uye:req.user, settings:settings,logo:logo})
}

module.exports = {
    showIndexPage 
}