const { validationResult } = require('express-validator');
const User = require('../models/user_model');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const showAdminPanel = (req, res) => {
    res.render('admin_panel', { layout: 'layout/admin_layout.ejs', user: req.user })
}
const adminLogout = (req, res) => {
    req.logOut();
    req.flash('auth_success', [{ msg: 'Başarıyla Çıkış Yaptınız.' }])
    res.redirect('/login')
}
const showAdminProfile = (req, res) => {
    res.render('admin_profile', { layout: 'layout/admin_layout.ejs', user: req.user })
}
const updateAdminProfile = async (req, res) => {
    if(req.params.id){
        if (!req.file) {
            try {
                const sonuc = await User.findByIdAndUpdate(req.params.id, { ad: req.body.ad, soyad: req.body.soyad });
                if (sonuc) {
                    req.flash('auth_success', [{ msg: 'Profil güncellendi.' }])
                    res.redirect('/admin/update-user/'+req.params.id)
                }
    
            } catch (error) {
                req.flash('auth_errors', [{ msg: 'Hata çıktı' }]);
                res.redirect('/admin/update-user/'+req.params.id)
            }
        } else {
            const sonuc = await User.findById(req.params.id);
            if (sonuc.avatar != 'default.png') {
                fs.unlink(path.resolve(__dirname, '../uploads/admin') + '/' + sonuc.avatar, err => {
                    if (err) {
                        console.log('hata');
                    }
                });
            }
            try {
                const sonuc = await User.findByIdAndUpdate(req.params.id, { avatar: req.file.filename, ad: req.body.ad, soyad: req.body.soyad });
                if (sonuc) {
                    req.flash('auth_success', [{ msg: 'Profil güncellendi.' }])
                    res.redirect('/admin/update-user/'+req.params.id)
                }
            } catch (error) {
                req.flash('auth_errors', [{ msg: 'Hata çıktı' }]);
                res.redirect('/admin/update-user/'+req.params.id)
            }
        }
    }else{
        if (!req.file) {
            try {
                const sonuc = await User.findByIdAndUpdate(req.user.id, { ad: req.body.ad, soyad: req.body.soyad });
                if (sonuc) {
                    req.flash('auth_success', [{ msg: 'Profil güncellendi.' }])
                    res.redirect('/admin/me')
                }
    
            } catch (error) {
                req.flash('auth_errors', [{ msg: 'Hata çıktı' }]);
                res.redirect('/admin/me')
            }
        } else {
            if (req.user.avatar != 'default.png') {
                fs.unlink(path.resolve(__dirname, '../uploads/admin') + '/' + req.user.avatar, err => {
                    if (err) {
                        console.log('hata');
                    }
                });
            }
            try {
                const sonuc = await User.findByIdAndUpdate(req.user.id, { avatar: req.file.filename, ad: req.body.ad, soyad: req.body.soyad });
                if (sonuc) {
                    req.flash('auth_success', [{ msg: 'Profil güncellendi.' }])
                    res.redirect('/admin/me')
                }
            } catch (error) {
                req.flash('auth_errors', [{ msg: error.message }]);
                res.redirect('/admin/me')
            }
        }
    }
}
const deleteMe = async (req, res) => {
    try {
        const sonuc = await User.findByIdAndDelete(req.user.id);
        if (sonuc) {
            if(req.user.avatar != 'default.png'){
                await fs.unlink(path.resolve(__dirname,'../uploads/admin/'+req.user.avatar),err=>{
                    console.log(err)
                })
            }
            req.logOut();
            req.flash('auth_success', [{ msg: 'Hesabın Silindi Eğer Geri Dönmek İstersen, Aynı Eposta ile Kayıt Olabilirsin.' }])
            res.redirect('/login')
        }
    } catch (error) {
        req.flash('auth_errors', [{ msg: 'Hata Çıktı' }])
        res.redirect('/admin/me')
    }
}
const showUsersPage = async (req,res) => {
    const allUsers = await User.find().sort({_id:'desc'});
    res.render('users',{layout:'layout/users_layout',user:req.user,allUsers:allUsers})
}
const deleteUserById = async (req,res) => {
    const ID = req.params.id;
    await User.findByIdAndDelete(ID,{},(err)=>{
        if(err){
            req.flash('auth_errors',[{msg:'Kullanıcı Bulunamadı.'}])
            res.redirect('/admin/users')
        }else{
            req.flash('auth_success',[{msg:'Kullanıcı tamamen silindi.'}])
            res.redirect('/admin/users')
        }
    });
   
}
const showAndUpdateUserPage = async (req,res)=>{
    const ID = req.params.id;
    await User.findById(ID,{},(err,decoded)=>{
        if(err){
            req.flash('auth_errors',[{msg:'Kullanıcı Bulunamadı.'}])
            res.redirect('/admin/users')
        }else{
            res.render('oneUser',{layout:'layout/admin_layout',user:decoded})
        }
    });
}
const addUser = async (req,res)=>{
    const hatalar = validationResult(req);
    if(!hatalar.isEmpty()){
        req.flash('auth_errors',hatalar.errors);
        res.redirect('/admin/users')
    }else{
        const _user = await new User(req.body);
        _user.pass = await bcrypt.hash(_user.pass,8);
        await _user.save();
        req.flash('auth_success',[{msg:'Kullanıcı Başarıyla eklendi.'}]);
        res.status(201).redirect('/admin/users')
    }
}

module.exports = {
    showAdminPanel,
    adminLogout,
    showAdminProfile,
    updateAdminProfile,
    deleteMe,
    showUsersPage,
    deleteUserById,
    showAndUpdateUserPage,
    addUser
}