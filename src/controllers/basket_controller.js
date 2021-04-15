const ProductModel = require('../models/product_model');
const HeaderSettings = require('../models/header_model');
const mysql = require('../config/mysql_database');

const addProductToBasket = async (req, res) => {
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
const showBasketPage = async (req, res) => {
    const settings = await HeaderSettings.find();
    const logo = await settings.filter(setting => {
        if (setting.headerSettingAd == "logo") {
            return setting.headerSettingLink
        }
    })

    const sql = 'SELECT * FROM sepet WHERE sepet_sahip_id=?';
    const value = [[req.user._id]];
    mysql.query(sql, [value], (err, result) => {
        if (err) {
            return res.redirect('/');
        }
        if (result.length) {
            const sql1 = 'SELECT * FROM sepet_detay WHERE sepet_detay.sepet_id=?';
            const value1 = [[result[0].sepet_id]];
            mysql.query(sql1, [value1], (err, result) => {
                if (err) {
                    return res.redirect('/');
                }
                if (result) {
                    let results = result;
                    results.forEach(element => {
                        const sql2 = 'SELECT * FROM products JOIN sepet_detay ON products.products_id = sepet_detay.urun_id WHERE sepet_detay.urun_id=? ';
                        const value2 = [[element.urun_id]];
                        mysql.query(sql2, [value2], async (err, result) => {
                            if (err) {
                                return res.redirect('/');
                            }
                            if (result) {
                                const settings = await HeaderSettings.find();
                                const logo = await settings.filter(setting => {
                                    if (setting.headerSettingAd == "logo") {
                                        return setting.headerSettingLink
                                    }
                                })
                                
                                res.setHeader('Content-Type', 'text/html');
                                return res.render("default/basket.ejs", { layout: "defaultLayout/default_layout.ejs", uye: req.user, settings: settings, logo: logo, basketProducts: result })
                            }
                        })
                    });
                }

            })
        } else {
            return res.render("default/basket.ejs", { layout: "defaultLayout/default_layout.ejs", uye: req.user, settings: settings, logo: logo, basketProducts: undefined })
        }
    })
}




module.exports = {
    addProductToBasket,
    showBasketPage
}