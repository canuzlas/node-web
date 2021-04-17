const { validationResult } = require('express-validator');
const Iyzipay = require('iyzipay');
const ProductModel = require('../models/product_model');
const HeaderSettings = require('../models/header_model');
const mysql = require('../config/mysql_database');
const util = require('util');
const { setTimeout } = require('timers');
const query = util.promisify(mysql.query).bind(mysql);

const addProductToBasket = async (req, res, next) => {
    const product = await ProductModel.findById(req.body.urunid, err => {
        if (err) {
            res.send({ status: false });
        }
    });
    if (product == null) {
        res.send({ status: false });
    } else {
        const sqlsorgu = 'SELECT * FROM sepet WHERE sepet_sahip_id =?';
        const valuessorgu = [[req.user._id.toString()]]
        mysql.query(sqlsorgu, [valuessorgu], (err, result) => {
            if (err) {
                res.send({ status: false });
            }
            if (!result.length) {
                const sql = 'INSERT INTO sepet (sepet_sahip_id) VALUES ?';
                const values = [[req.user._id.toString()]]
                mysql.query(sql, [values], (err, result) => {
                    if (err) {
                        res.send({ status: false });
                    }
                    if (result) {
                        const sql1 = 'INSERT INTO sepet_detay (sepet_id,urun_id,urun_fiyat,urun_adet) VALUES ?';
                        const values1 = [[result.insertId, product._id.toString(), product.urunFiyat, 1]]
                        mysql.query(sql1, [values1], (err, result) => {
                            if (err) {
                                res.send({ status: false });
                            }
                            if (result) {
                                res.send({ status: true });
                            }
                        })
                    }
                })
            } else {
                const sqlsepetsorgu = 'SELECT * FROM sepet_detay WHERE sepet_id =? and urun_id=?';
                const valuessepetsahipid = result[0].sepet_id;
                const urunsoruid = product._id.toString();
                mysql.query(sqlsepetsorgu, [valuessepetsahipid, urunsoruid], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.send({ status: false });
                    }
                    if (!result.length) {
                        const sqlsepetidsorgu = 'SELECT * FROM sepet WHERE sepet_sahip_id =? ';
                        const sepetidvalues = req.user._id.toString();
                        mysql.query(sqlsepetidsorgu, sepetidvalues, (err, result) => {
                            if (err) {
                                res.send({ status: false });
                            }
                            if (result) {
                                const sql1 = 'INSERT INTO sepet_detay (sepet_id,urun_id,urun_fiyat,urun_adet) VALUES ?';
                                const values1 = [[result[0].sepet_id, product._id.toString(), product.urunFiyat, 1]]
                                mysql.query(sql1, [values1], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        res.send({ status: false });
                                    }
                                    if (result) {
                                        res.send({ status: true });
                                    }
                                })
                            }
                        })
                    } else {
                        const sqlupdate = 'UPDATE sepet_detay SET urun_adet =? where sepet_id =? and urun_id=?  ';
                        const urun_adet = parseInt(result[0].urun_adet) + 1;
                        const sepet_id = result[0].sepet_id;
                        const urun_id = product._id.toString();
                        mysql.query(sqlupdate, [urun_adet, sepet_id, urun_id], (err, result) => {
                            if (err) {
                                res.send({ status: false });
                            }
                            if (result) {
                                res.send({ status: true });
                            }
                        })
                    }
                })
            }
        })
    }
}
const showBasketPage = async (req, res, next) => {

    const settings = await HeaderSettings.find();
    const logo = await settings.filter(setting => {
        if (setting.headerSettingAd == "logo") {
            return setting.headerSettingLink
        }
    })

    const sql = 'SELECT * FROM sepet WHERE sepet_sahip_id=?';
    const value = [[String(req.user._id)]];
    const sepetsonuc = await query(sql, [value])

    if (sepetsonuc.length) {
        const sql1 = 'SELECT * FROM sepet_detay WHERE sepet_detay.sepet_id=?';
        const value1 = [[sepetsonuc[0].sepet_id]];
        const sepetdetaysonuc = await query(sql1, [value1])

        if (sepetdetaysonuc.length) {
            let resdata = [];
            let totalprice = 0;
            for (let i = 0; i <= sepetdetaysonuc.length - 1; i++) {
                const sql2 = 'SELECT * FROM products JOIN sepet_detay ON products.products_id = sepet_detay.urun_id WHERE sepet_detay.urun_id=? ';
                const value2 = [[sepetdetaysonuc[i].urun_id]];
                const sonuc = await query(sql2, [value2])
                resdata.push(sonuc);
                totalprice += (sepetdetaysonuc[i].urun_fiyat * sepetdetaysonuc[i].urun_adet)
            }
            return res.render("default/basket.ejs", { layout: "defaultLayout/default_layout.ejs", uye: req.user, settings: settings, logo: logo, basketProducts: resdata, total: totalprice })

        } else {
            return res.render("default/basket.ejs", { layout: "defaultLayout/default_layout.ejs", uye: req.user, settings: settings, logo: logo, basketProducts: undefined })
        }

    } else {
        return res.render("default/basket.ejs", { layout: "defaultLayout/default_layout.ejs", uye: req.user, settings: settings, logo: logo, basketProducts: undefined })
    }

}
const removeİtemFromBasket = async (req, res, next) => {
    let data = String(req.body.data);
    let urunid = data.split('/')[0];
    let sepetid = data.split('/')[1];

    const sql = "SELECT * FROM sepet_detay WHERE sepet_detay_id=? and urun_id=?";
    const value = [sepetid, urunid];
    const sonuc = await query(sql, value)
    if (sonuc.length) {

        const sql1 = "DELETE  FROM sepet_detay WHERE sepet_detay_id=? and urun_id=?";
        const value1 = [sepetid, urunid];
        const sonuc1 = await query(sql1, value1)

        if (sonuc1) {
            return res.send({ status: true })
        } else {
            return res.send({ status: false })
        }
    } else {
        return res.send({ status: false })
    }
}
const showBasketStep1Page = async (req, res, next) => {
    const settings = await HeaderSettings.find();
    const logo = await settings.filter(setting => {
        if (setting.headerSettingAd == "logo") {
            return setting.headerSettingLink
        }
    })
    const sql = 'SELECT * FROM sepet WHERE sepet_sahip_id=?';
    const value = [[String(req.user._id)]];
    const sepetsonuc = await query(sql, [value])
    const sql1 = 'SELECT * FROM sepet_detay WHERE sepet_detay.sepet_id=?';
    const value1 = [[sepetsonuc[0].sepet_id]];
    const sepetdetaysonuc = await query(sql1, [value1])

    if (sepetdetaysonuc.length) {
        return res.render("default/basket-step1.ejs", { layout: "defaultLayout/default_layout.ejs", uye: req.user, settings: settings, logo: logo })
    } else {
        return res.redirect('/')
    }
}
const payPage = async (req, res, next) => {
    const hatalar = validationResult(req);
    if (!hatalar.isEmpty()) {
        req.flash('auth_errors', hatalar.array());
        return res.redirect('/basket/step1')
    } else {
        const sql = 'SELECT * FROM sepet WHERE sepet_sahip_id=?';
        const value = [[String(req.user._id)]];
        const sepetsonuc = await query(sql, [value])

        if (sepetsonuc.length) {
            const sql1 = 'SELECT * FROM sepet_detay WHERE sepet_detay.sepet_id=?';
            const value1 = [[sepetsonuc[0].sepet_id]];
            const sepetdetaysonuc = await query(sql1, [value1])

            if (sepetdetaysonuc.length) {
                let resdata = [];
                let totalprice = 0;
                for (let i = 0; i <= sepetdetaysonuc.length - 1; i++) {
                    const sql2 = 'SELECT * FROM products JOIN sepet_detay ON products.products_id = sepet_detay.urun_id WHERE sepet_detay.urun_id=? ';
                    const value2 = [[sepetdetaysonuc[i].urun_id]];
                    const sonuc = await query(sql2, [value2])
                    resdata.push(sonuc);
                    totalprice += (sepetdetaysonuc[i].urun_fiyat * sepetdetaysonuc[i].urun_adet)
                }
                const basketItemsArray = async () => {
                    let basketItemsArray = []
                    for (let i = 0; i <= resdata.length - 1; i++) {
                        let obj = {
                            id: null,
                            name: null,
                            category1: null,
                            itemType: null,
                            price: null
                        }
                        obj.id = resdata[i][0].urun_id;
                        obj.name = resdata[i][0].products_ad;
                        obj.category1 = 'uzlasyazilim';
                        obj.itemType = Iyzipay.BASKET_ITEM_TYPE.VIRTUAL
                        obj.price = resdata[i][0].urun_fiyat * resdata[i][0].urun_adet;
                        basketItemsArray.push(obj)
                    }
                    return new Promise((resolve, reject) => {
                        setTimeout(resolve(basketItemsArray), 0.5)
                    })
                }

                const data = await basketItemsArray();
                var iyzipay = new Iyzipay({
                    apiKey: "sandbox-j1Ym48XjB6KXhMPxVoiWJ8U2vHKFol7J",
                    secretKey: "sandbox-z1ygeYjmp3jo7Hh8T0V8AZ8O21SXfsDw",
                    uri: 'https://sandbox-api.iyzipay.com'
                });

                var request = {
                    locale: Iyzipay.LOCALE.TR,
                    conversationId: String(req.user._id),
                    price: String(totalprice),
                    paidPrice: String(totalprice),
                    currency: Iyzipay.CURRENCY.TRY,
                    basketId: String(sepetsonuc[0].sepet_id),
                    paymentGroup: Iyzipay.PAYMENT_GROUP.LISTING,
                    callbackUrl: 'http://localhost:3000/basket/paycallback',
                    enabledInstallments: [2, 3, 6, 9],
                    buyer: {
                        id: String(req.user._id),
                        name: String(req.body.siparisAd),
                        surname: String(req.body.siparisSoyad),
                        gsmNumber: String(req.body.siparisGsm),
                        email: String(req.body.siparisEmail),
                        identityNumber: String(req.body.siparisTC),
                        registrationAddress: String(req.body.siparisAdres),
                        ip: '0.0.0.0',
                        city: String(req.body.siparisİl),
                        country: String(req.body.siparisUlke)
                    },
                    shippingAddress: {
                        contactName: String(req.body.siparisAd) + ' ' + String(req.body.siparisSoyad),
                        city: String(req.body.siparisİl),
                        country: String(req.body.siparisUlke),
                        address: String(req.body.siparisAdres),
                    },
                    billingAddress: {
                        contactName: String(req.body.siparisAd) + ' ' + String(req.body.siparisSoyad),
                        city: String(req.body.siparisİl),
                        country: String(req.body.siparisUlke),
                        address: String(req.body.siparisAdres),
                    },
                    basketItems: data


                };
                iyzipay.checkoutFormInitialize.create(request, function (err, result) {

                    res.send(result.checkoutFormContent + '<div id="iyzipay-checkout-form" class="responsive"></div>');
                });



            }
        }
    }
}
const paycallback = async (req, res, next) => {

    const settings = await HeaderSettings.find();
    const logo = await settings.filter(setting => {
        if (setting.headerSettingAd == "logo") {
            return setting.headerSettingLink
        }
    })

    var iyzipay = new Iyzipay({
        apiKey: "sandbox-j1Ym48XjB6KXhMPxVoiWJ8U2vHKFol7J",
        secretKey: "sandbox-z1ygeYjmp3jo7Hh8T0V8AZ8O21SXfsDw",
        uri: 'https://sandbox-api.iyzipay.com'
    });
    iyzipay.checkoutForm.retrieve({
        locale: Iyzipay.LOCALE.TR,
        token: String(req.body.token)
    }, async function (err, result) {
        if (result.status == 'failure') {
            let uye = true;
            let sonuc = { msg: result.errorMessage + ' lütfen kart bilgilerinizi kontrol edin.' };
            return res.render("default/callbacksonucPage.ejs", { layout: "defaultLayout/default_layout.ejs", settings: settings, logo: logo, uye: uye, sonuc: sonuc })
        } else if (result.status == 'success') {
            let sql = "INSERT INTO siparis (siparis_no,siparis_toplam) VALUES (" + result.basketId + ',' + result.paidPrice + ')';
            let sonuc = await query(sql);
            if (sonuc.affectedRows >= 1) {
                let allsonuc = [];
                for (let i = 0; i <= parseInt(result.itemTransactions.length) - 1; i++) {
                    let sql = "INSERT INTO siparis_detay (siparis_id,urun_id) VALUES (" + sonuc.insertId + ',' + result.itemTransactions[i].itemId + ')';
                    let sonuc = await query(sql);
                    allsonuc.push(sonuc)
                }
                console.log(allsonuc);
            }
        }
    });
}


module.exports = {
    addProductToBasket,
    showBasketPage,
    removeİtemFromBasket,
    showBasketStep1Page,
    payPage,
    paycallback,
}