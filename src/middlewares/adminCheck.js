const adminCheck = (req,res,next)=>{
    if (req.session.admin == "true") {
        next()
    } else {
        req.flash('auth_errors',[{msg:'Bu Sayfaya Girmek İçin Yetkiniz Yok'}])
        res.redirect('/login')
    }
}

module.exports = {
    adminCheck
}

