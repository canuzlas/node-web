const showIndexPage = (req,res) => {
        res.render("default/index.ejs",{layout: "defaultLayout/default_layout.ejs",uye:req.session.uye})
    
}


module.exports = {
    showIndexPage 
}