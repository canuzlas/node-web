const { validationResult } = require('express-validator');
const User = require('../models/user_model');
const Product = require('../models/product_model');
const HeaderSettings = require('../models/header_model');
const connectMYSQL = require("../config/mysql_database");
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const md5 = require("md5");


const showAdminPanel = (req, res) => {
    res.render('adminPanel/admin_panel', { layout: 'layout/admin_layout.ejs', user: req.session.user })
}
const PanelLoginPageShow = (req, res) => {
    res.render('adminPanel/login-panel', { layout: 'layout/auth_layout.ejs' })
}
const loginAdminPanel = (req, res) => {

    const sql = "SELECT * FROM admin WHERE admin_email =? and admin_pass = ? ";
    const mail = req.body.adminemail;
    const pass = md5(req.body.adminpass);

    connectMYSQL.query(sql, [mail, pass], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result) {

            req.session.admin = "true";
            const user = { ad: result[0].admin_ad, soyad: result[0].admin_soyad, email: result[0].admin_email, avatar: "default.png" };
            req.session.user = user;

            res.redirect('/admin/panel')
        }
    })
}
const adminLogout = (req, res) => {
    req.logOut();
    delete req.session.admin;
    req.flash('auth_success', [{ msg: 'Başarıyla Çıkış Yaptınız.' }])
    res.redirect('/admin/panel-login')
}
const showAdminProfile = (req, res) => {
    res.render('adminPanel/admin_profile', { layout: 'layout/admin_layout.ejs', user: req.session.user })
}
const updateAdminProfile = async (req, res) => {
    if (req.params.id) {
        if (!req.file) {
            try {
                const sonuc = await User.findByIdAndUpdate(req.params.id, { ad: req.body.ad, soyad: req.body.soyad });
                if (sonuc) {
                    req.flash('auth_success', [{ msg: 'Profil güncellendi.' }])
                    res.redirect('/admin/update-user/' + req.params.id)
                }

            } catch (error) {
                req.flash('auth_errors', [{ msg: 'Hata çıktı' }]);
                res.redirect('/admin/update-user/' + req.params.id)
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
                    res.redirect('/admin/update-user/' + req.params.id)
                }
            } catch (error) {
                req.flash('auth_errors', [{ msg: 'Hata çıktı' }]);
                res.redirect('/admin/update-user/' + req.params.id)
            }
        }
    } else {
        if (!req.file) {
            try {

                const sql = "UPDATE admin SET admin_ad =?,admin_soyad=? WHERE admin_email =?";
                const ad = req.body.ad;
                const soyad = req.body.soyad;
                const email = req.body.email;

                console.log(req.body.ad, req.body.soyad, req.body.email);

                connectMYSQL.query(sql, [ad, soyad, email], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    if (result) {

                        console.log(result);
                        const user = { ad: req.body.ad, soyad: req.body.soyad, email: req.body.email, avatar: "default.png" };
                        req.session.user = user;
                        req.flash('auth_success', [{ msg: 'Profil güncellendi.' }])
                        res.redirect('/admin/me')
                    }
                })

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
            if (req.user.avatar != 'default.png') {
                await fs.unlink(path.resolve(__dirname, '../uploads/admin/' + req.user.avatar), err => {
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
const showUsersPage = async (req, res) => {
    const allUsers = await User.find().sort({ _id: 'desc' });
    res.render('adminPanel/users', { layout: 'layout/users_layout', user: req.session.user, allUsers: allUsers })
}
const deleteUserById = async (req, res) => {
    const ID = req.params.id;
    await User.findByIdAndDelete(ID, {}, (err) => {
        if (err) {
            req.flash('auth_errors', [{ msg: 'Kullanıcı Bulunamadı.' }])
            res.redirect('/admin/users')
        } else {
            req.flash('auth_success', [{ msg: 'Kullanıcı tamamen silindi.' }])
            res.redirect('/admin/users')
        }
    });

}
const showAndUpdateUserPage = async (req, res) => {
    const ID = req.params.id;
    await User.findById(ID, {}, (err, decoded) => {
        if (err) {
            req.flash('auth_errors', [{ msg: 'Kullanıcı Bulunamadı.' }])
            res.redirect('/admin/users')
        } else {
            res.render('adminPanel/oneUser', { layout: 'layout/admin_layout', decoded: decoded, user: req.session.user })
        }
    });
}
const addUser = async (req, res) => {
    const hatalar = validationResult(req);
    if (!hatalar.isEmpty()) {
        req.flash('auth_errors', hatalar.errors);
        res.redirect('/admin/users')
    } else {
        const _user = await new User(req.body);
        _user.pass = await bcrypt.hash(_user.pass, 8);
        await _user.save();
        req.flash('auth_success', [{ msg: 'Kullanıcı Başarıyla eklendi.' }]);
        res.status(201).redirect('/admin/users')
    }
}
const showProducts = async (req, res) => {
    const products = await Product.find().sort({ _id: 'desc' });
    res.render('adminPanel/showProducts', { layout: 'layout/users_layout', products: products, user: req.session.user })
}
const addProduct = async (req, res) => {


    const _product = await new Product(req.body);
    _product.urunFoto = req.file.filename;
    const sonuc = await _product.save();
    if (sonuc) {
        req.flash('auth_success', [{ msg: 'Ürün Başarıyla eklendi.' }]);
        res.status(201).redirect('/admin/urunler')
    }

    connection.connect(err => {

        if (!err) {
            console.log("mysql bağlandi");
        }
        const sql = "INSERT INTO products (products_id,products_ad,products_fiyat) VALUES ?";
        var values = [
            [_product._id, _product.urunAd, _product.urunFiyat]
        ];

        connection.query(sql, [values], (err, result) => {
            if (!err) {
                console.log("kaydedildi");
            }
        })

    })

}
const deleteProductById = async (req, res) => {
    const ID = req.params.id;
    const product = await Product.findById(ID);
    const foto = product.urunFoto;

    const sonuc = await Product.findByIdAndDelete(ID, {}, (err, decoded) => {
        if (err) {
            req.flash('auth_errors', [{ msg: 'Ürün Bulunamadı.' }])
            res.redirect('/admin/urunler')
        } else {
            connection.connect(err => {

                if (!err) {
                    console.log("mysql bağlandi");
                }
                const sql = "DELETE FROM products WHERE products_id=?";
                var values = [
                    [ID]
                ];

                connection.query(sql, [values], (err, result) => {
                    if (!err) {
                        console.log("silindi");
                    }
                })

            })
            fs.unlink(path.resolve(__dirname, '../uploads/products/' + foto), err => {
                if (err)
                    console.log(err)
            })
            req.flash('auth_success', [{ msg: 'Ürün tamamen silindi.' }])
            res.redirect('/admin/urunler')
        }
    });

}
const showThisProductPage = async (req, res) => {
    const ID = req.params.id;
    await Product.findById(ID, {}, (err, decoded) => {
        if (err) {
            req.flash('auth_errors', [{ msg: 'Kullanıcı Bulunamadı.' }])
            res.redirect('/admin/urunler')
        } else {
            res.render('adminPanel/oneProduct', { layout: 'layout/admin_layout', product: decoded, user: req.session.user })

        }
    });
}
const updateProduct = async (req, res) => {

    if (req.params.id) {
        if (!req.file) {
            try {
                const sonuc = await Product.findByIdAndUpdate(req.params.id, { urunAd: req.body.urunAd, urunFiyat: req.body.urunFiyat, urunAciklama: req.body.urunAciklama, urunStok: req.body.urunStok, urunOneCikar: req.body.urunOneCikar });
                if (sonuc) {
                    req.flash('auth_success', [{ msg: 'Ürün güncellendi.' }])
                    res.redirect('/admin/show-product/' + req.params.id)
                }

            } catch (error) {
                req.flash('auth_errors', [{ msg: 'Hata çıktı' }]);
                res.redirect('/admin/show-product/' + req.params.id)
            }
        } else {
            const sonuc = await Product.findById(req.params.id);
            if (sonuc) {
                fs.unlink(path.resolve(__dirname, '../uploads/products') + '/' + sonuc.urunFoto, err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            try {
                const sonuc = await Product.findByIdAndUpdate(req.params.id, { urunAd: req.body.urunAd, urunFiyat: req.body.urunFiyat, urunAciklama: req.body.urunAciklama, urunStok: req.body.urunStok, urunOneCikar: req.body.urunOneCikar, urunFoto: req.file.filename });
                if (sonuc) {
                    req.flash('auth_success', [{ msg: 'Profil güncellendi.' }])
                    res.redirect('/admin/show-product/' + req.params.id)
                }
            } catch (error) {
                req.flash('auth_errors', [{ msg: 'Hata çıktı' }]);
                res.redirect('/admin/show-product/' + req.params.id)
            }
        }
    } else {
        res.redirect('404');
    }
}
const showHeaderAllSettings = async (req, res) => {
    const headersettings = await HeaderSettings.find();

    res.render('adminPanel/headersettings.ejs', { layout: 'layout/admin_layout.ejs', headersettings: headersettings, user: req.session.user })
}
const showHeaderOneSetting = async (req, res) => {
    const settingİd = req.params.id;
    const setting = await HeaderSettings.findById(settingİd);
    res.render('adminPanel/oneHeaderSetting.ejs', { layout: 'layout/admin_layout.ejs', setting: setting, user: req.session.user })
}
const updateHeaderOneSetting = async (req, res) => {
    const id = req.params.id;
    if (req.file) {
        const sonuc = await HeaderSettings.findByIdAndUpdate(id, { headerSettingAd: req.body.headerSettingAd, headerSettingDesc: req.body.headerSettingDesc, headerSettingLink: req.file.filename });
        if (sonuc) {
            console.log(sonuc);
            req.flash('auth_success', [{ msg: 'Ayar güncellendi.' }])
            res.redirect('/admin/show-header-setting/' + id)
        } else {
            req.flash('auth_errors', [{ msg: 'Ayar güncelleme başarısız.' }])
            res.redirect('/admin/show-header-setting/' + id)
        }
    } else {
        const sonuc = await HeaderSettings.findByIdAndUpdate(id, { headerSettingAd: req.body.headerSettingAd, headerSettingDesc: req.body.headerSettingDesc, headerSettingLink: req.body.headerSettingLink });
        if (sonuc) {
            console.log(sonuc);
            req.flash('auth_success', [{ msg: 'Ayar güncellendi.' }])
            res.redirect('/admin/show-header-setting/' + id)
        } else {
            req.flash('auth_errors', [{ msg: 'Ayar güncelleme başarısız.' }])
            res.redirect('/admin/show-header-setting/' + id)
        }
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
    addUser,
    showProducts,
    addProduct,
    deleteProductById,
    showThisProductPage,
    updateProduct,
    PanelLoginPageShow,
    loginAdminPanel,
    showHeaderAllSettings,
    showHeaderOneSetting,
    updateHeaderOneSetting
}