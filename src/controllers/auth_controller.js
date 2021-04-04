const { validationResult } = require('express-validator')
const User = require('../models/user_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const passport = require('passport')
const axios = require('axios')
require('../config/passport_local')(passport)


const showLoginPage = (req, res) => {
    res.render('userLoginRegister/login', { layout: 'layout/auth_layout.ejs' })
}
const loginCheckPageShow = async (req, res) => {

    if (req.params.check) {

        if (req.body.checkcode == req.session.dogrulamaKodu) {
            delete req.session.dogrulamaKodu;
            delete req.session.mail;
            res.redirect('/admin/panel')
        } else {
            req.flash('auth_errors', [{ msg: 'Girdiğiniz kod hatalı.' }]);
            res.redirect('/check')
        }
    } else {

        if (!req.session.mail) {
            req.flash('auth_errors', [{ msg: 'Başka yerde oyna aslanım.' }]);
            res.redirect('/login')
            
        } else {

            const dogrulamaKodu = Math.floor(Math.random() * 1000000);
            req.session.dogrulamaKodu = dogrulamaKodu;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.gmail_user,
                    pass: process.env.gmail_pass
                }
            });

            const mailOptions = {
                from: 'Uzlaş Yazılım',
                to: req.session.mail,
                subject: 'Doğrulama Kodu',
                html: 'Merhaba' +

                    'Sitemize giriş yapabilmek için lütfen aşağıdaki kodu açılan sayfaya giriniz.  <br><br>' +
                    dogrulamaKodu +
                    '<br><br>  İyi Günler,<br>Uzlaş Yazılım'

            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    req.flash('auth_errors', [{ msg: 'Hata oluştu lütfen yetkili birinine danışın.' }]);
                    res.redirect('/login')
                } else {
                    res.render('userLoginRegister/check', { layout: 'layout/auth_layout.ejs' })
                    transporter.close()
                }
            });
        }


    }


}
const showRegisterPage = (req, res) => {
    res.render('userLoginRegister/register', { layout: 'layout/auth_layout.ejs' })
}
const showForgotPage = (req, res) => {
    res.render('userLoginRegister/forgot', { layout: 'layout/auth_layout.ejs' })
}
const registerMe = async (req, res) => {
    const hatalar = validationResult(req);
    const formİnputVal = [req.body.ad, req.body.soyad, req.body.email]
    if (!hatalar.isEmpty()) {
        req.flash('auth_errors', hatalar.array())
        req.flash('form_input', formİnputVal)
        res.redirect('/register')
    } else {

        const _user = await User.findOne({ email: req.body.email });
        if (_user && _user.aktif == true) {
            req.flash('form_input', formİnputVal);
            req.flash('auth_errors', [{ msg: 'Bu mail zaten kullanımda' }]);
            res.redirect('/register')
        } else {
            if (_user) {
                User.findByIdAndDelete(_user._id)
            }
            const saveUser = await new User(req.body);
            saveUser.pass = await bcrypt.hash(saveUser.pass, 8);
            saveUser.save()

            const jwtİnfo = {
                id: saveUser._id,
                email: saveUser.email
            }
            const token = await jwt.sign(jwtİnfo, process.env.JWTSECRETKEY, { expiresIn: '1d' });
            const url = process.env.WEB_SITE_URL + 'verifyEmail?token=' + token;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.gmail_user,
                    pass: process.env.gmail_pass
                }
            });

            const mailOptions = {
                from: 'Uzlaş Yazılım',
                to: saveUser.email,
                subject: 'Verify Account',
                html: 'Merhaba' + '<p style="color:black;font-weight:bold;padding-left:10px">' + saveUser.ad + ',</p>' +

                    'Sitemize bir kayıt oluşturdunuz. Eğer hesabı aktif etmek istiyorsanız alttaki butona tıklayın : <br><br>' +
                    '<a href="' + url + '"style="text-decoration: none;background-color:gray;color:white;font-size:15px;margin-left:200px;margin-top:10px;padding:10px;border-radius:10px;display:inline-block">Hesabımı Aktif Et</a> <br><br> Eğer butona tıklanmıyorsa alttaki linki lütfen kopyalayıp tarayıcınıza yapıştırın : <br><br> ' + url + '<br><br>  İyi Günler,<br>Uzlaş Yazılım'

            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    req.flash('auth_errors', [{ msg: 'Hata oluştu lütfen yetkili birinine danışın veya yeniden kayıt olmayı deneyin' }]);
                    res.redirect('/register')
                } else {
                    req.flash('auth_success', [{ msg: 'Kayıt olma işlemi başarılı !' }, { msg: 'Lütfen mail kutunuzu kontrol edin.' }]);

                    res.redirect('/login');
                    transporter.close()
                }
            });

        }
    }
}
const verifyEmail = async (req, res) => {
    const token = req.query.token;
    if (token) {
        jwt.verify(token, process.env.JWTSECRETKEY, async (err, decoded) => {
            if (err) {
                req.flash('auth_errors', [{ msg: 'Token Hatalı veya Süresi Geçmiş.!' }]);
                res.redirect('/login')
            } else {
                await User.findByIdAndUpdate(decoded.id, { aktif: true });
                req.flash('auth_success', [{ msg: 'Email onay işlemi başarılı. Giriş yapabilirsiniz.' }]);
                res.redirect('/login')
            }
        })
    } else {
        req.flash('auth_errors', [{ msg: 'Token Bulunamadı.!' }]);
        res.redirect('/login')
    }
}
const login = async (req, res, next) => {
    const hatalar = validationResult(req);
    if (!hatalar.isEmpty()) {
        req.flash('auth_errors', hatalar.array())
        res.redirect('/login')
    } else {
        req.session.mail = req.body.email;
        passport.authenticate('local', {
            successRedirect: '/check',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    }
}
const forgotMyPass = async (req, res) => {

    const hatalar = validationResult(req);
    if (!hatalar.isEmpty()) {
        req.flash('auth_errors', hatalar.array());
        res.redirect('/forgot')
    } else {
        const _user = await User.findOne({ email: req.body.email });
        if (!_user) {
            req.flash('auth_errors', [{ msg: 'Maalesef bu mail sistemimizde kayıtlı değil.' }]);
            res.redirect('/forgot')
        } else if (_user && _user.aktif == false) {
            req.flash('auth_errors', [{ msg: 'Böyle bir mail yok veya pasif durumda.' }]);
            res.redirect('/forgot')
        } else if (_user && (_user.authGoogle == true || _user.authFacebook == true)) {
            if (_user.authGoogle == true) {
                res.redirect('https://support.google.com/mail/answer/41078?co=GENIE.Platform%3DDesktop&hl=tr&oco=1')
            } else {
                res.redirect('https://www.facebook.com/login/identify/?ctx=recover&ars=facebook_login&from_login_screen=0')
            }
        } else {
            const payload = {
                id: _user._id,
                email: _user.email
            }
            const secretKey = process.env.JWTSECRETKEY + '-' + _user.pass;
            const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });
            const url = process.env.WEB_SITE_URL + 'new-pass/' + _user._id + '/' + token;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.gmail_user,
                    pass: process.env.gmail_pass
                }
            });

            const mailOptions = {
                from: 'Uzlaş Yazılım',
                to: _user.email,
                subject: 'Forgot Password',
                html: 'Merhaba' + '<p style="color:black;font-weight:bold;padding-left:10px">' + _user.ad + ',</p>' +

                    'Sanırsam şifreni unuttun :). Şifreni sıfırlamak için alttaki butona tıklaman yeterli. Bu işlem için 1 gün süren var : <br><br>' +
                    '<a href="' + url + '"style="text-decoration: none;background-color:red;color:white;font-size:15px;margin-left:200px;margin-top:10px;padding:10px;border-radius:10px;display:inline-block">Şifremi Sıfırla</a> <br><br> Eğer butona tıklanmıyorsa alttaki linki lütfen kopyalayıp tarayıcınıza yapıştırın : <br><br> ' + url + '<br><br>  İyi Günler,<br>Uzlaş Yazılım'

            };

            await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    req.flash('auth_errors', [{ msg: 'Hata oluştu lütfen yetkili birinine danışın veya yeniden deneyin' }]);
                    res.redirect('/forgot')
                } else {
                    req.flash('auth_success', [{ msg: 'Lütfen mail kutunuzu kontrol edin.' }]);

                    res.redirect('/forgot');
                    transporter.close()
                }
            });
        }
    }
}
const newPassPageShow = async (req, res) => {
    const urlid = req.params.id;
    const urltoken = req.params.token;
    if (urlid && urltoken) {
        const _user = await User.findById(urlid);
        if (!_user) {
            req.flash('auth_errors', [{ msg: 'Kullanıcı Bulunamadı veya Token Hatalı. Lütfen Tekrar Deneyin.' }]);
            res.redirect('/forgot')
        } else {
            const secretKey = process.env.JWTSECRETKEY + '-' + _user.pass;
            await jwt.verify(urltoken, secretKey, (err, decoded) => {
                if (err) {
                    req.flash('auth_errors', [{ msg: 'Token hatalı veya Şifrenizi Zaten Değiştirdiniz.' }]);
                    res.redirect('/forgot')
                } else {
                    res.render('userLoginRegister/new-pass', { layout: 'layout/auth_layout.ejs', id: urlid, token: urltoken })
                }
            })
        }

    } else {
        req.flash('auth_errors', [{ msg: 'Token bulunamadı. Mail kutunuzdaki linke tıklayın.' }]);
        res.redirect('/forgot')
    }

}
const newPass = async (req, res) => {
    const hatalar = validationResult(req);
    if (!hatalar.isEmpty()) {
        req.flash('auth_errors', hatalar.array());
        res.redirect('new-pass/' + req.body.id + '/' + req.body.token)
    } else {
        const _user = await User.findById(req.body.id);
        if (!_user) {
            res.redirect('new-pass/' + req.body.id + '/' + req.body.token)
        }
        const secretKey = process.env.JWTSECRETKEY + '-' + _user.pass;
        await jwt.verify(req.body.token, secretKey, async (err, decoded) => {
            if (err) {
                res.redirect('new-pass/' + req.body.id + '/' + req.body.token)
            } else {
                const hashedPass = await bcrypt.hash(req.body.pass, 8);
                const sonuc = await User.findByIdAndUpdate(decoded.id, { pass: hashedPass });
                if (sonuc) {
                    req.flash('auth_success', [{ msg: 'İşlem Başarılı. Şifreniz Değişti. Yeni Şifreniz ile Giriş Yapabilirsiniz.' }])
                    res.redirect('/login')
                }
            }
        })
    }
}



module.exports = {
    showLoginPage,
    showRegisterPage,
    showForgotPage,
    registerMe,
    verifyEmail,
    login,
    forgotMyPass,
    newPassPageShow,
    newPass,
    loginCheckPageShow
}