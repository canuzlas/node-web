const HeaderSettings = require('../models/header_model');
const SliderSettings = require('../models/slider_model');
const CategorySettings = require('../models/category_model');
const ProductsModel = require('../models/product_model');
const BultenEmailModel = require('../models/bulten_emails');
const { validationResult } = require('express-validator')

const showIndexPage = async (req, res) => {

    const settings = await HeaderSettings.find();
    const logo = await settings.filter(setting => {
        if (setting.headerSettingAd == "logo") {
            return setting.headerSettingLink
        }
    })
    const sliders = await SliderSettings.find();
    const categoryes = await CategorySettings.find();
    const oneCikanProducts = await ProductsModel.find({ urunOneCikar: true }).limit(6);

    res.render("default/index.ejs", { layout: "defaultLayout/default_layout.ejs", uye: req.user, settings: settings, logo: logo, sliders: sliders, categoryes: categoryes, oneCikanProducts: oneCikanProducts })
}
const showShopPage = async (req, res) => {

    const settings = await HeaderSettings.find();
    const logo = await settings.filter(setting => {
        if (setting.headerSettingAd == "logo") {
            return setting.headerSettingLink
        }
    })
    const categoryes = await CategorySettings.find();
    const allProductsCount = await ProductsModel.countDocuments();
    let buttonindex;
    let skip;
    if (req.query.page) {
        buttonindex = req.query.page;
        if (req.query.page == 1) {
            skip = 0
        } else {
            skip = (parseInt(req.query.page) - 1) * 6;
        }
    } else {
        buttonindex = 1
        skip = 0;
    }
    const allProductsPagination = await ProductsModel.find().limit(6).skip(parseInt(skip)).sort({ _id: 1 });

    res.render("default/shop.ejs", { layout: "defaultLayout/default_layout.ejs", uye: req.user, settings: settings, logo: logo, categoryes: categoryes, allProducts: allProductsPagination, productsCount: allProductsCount, buttonindex: parseInt(buttonindex), urunyok: undefined, isCP: undefined })

}
const showShopCategoryPage = async (req, res) => {
    if (req.params.category) {
        const settings = await HeaderSettings.find();
        const logo = await settings.filter(setting => {
            if (setting.headerSettingAd == "logo") {
                return setting.headerSettingLink
            }
        })
        const categoryes = await CategorySettings.find();
        const findCategory = await CategorySettings.find({ categoryLink: req.params.category }, err => {
            if (err) {
                res.redirect('/');
            }
        });
        if (findCategory == null) {
            res.redirect('/');
        } else {
            let buttonindex;
            let skip;
            if (req.query.page) {
                buttonindex = req.query.page;
                if (req.query.page == 1) {
                    skip = 0
                } else {
                    skip = (parseInt(req.query.page) - 1) * 6;
                }
            } else {
                buttonindex = 1
                skip = 0;
            }

            const allProductsPagination = await ProductsModel.find({ urunKategori: findCategory[0].id }).limit(6).skip(parseInt(skip)).sort({ _id: 1 });
            const allProductsCount = await ProductsModel.find({ urunKategori: findCategory[0].id }).countDocuments();
            let urunyok;
            if (!allProductsPagination.length) {
                urunyok = 'true';
            } else {
                urunyok = 'false';
            }

            res.render("default/shop.ejs", { layout: "defaultLayout/default_layout.ejs", uye: req.user, settings: settings, logo: logo, categoryes: categoryes, allProducts: allProductsPagination, productsCount: allProductsCount, buttonindex: buttonindex, urunyok: urunyok, isCP: true, activeCategory: findCategory[0].categoryLink })
        }
    } else {
        res.redirect('/404');
    }
}
const registerBulten = async (req, res) => {
    const hatalar = validationResult(req);

    if (!hatalar.isEmpty()) {
        res.send({ status: false, hata: hatalar.errors[0].msg })
    } else {
        const checkemail = await BultenEmailModel.find({ bultenEmail: req.body.bultenemail });
        if (!checkemail.length) {
            console.log(req.body.bultenemail);
            const userbulten = await new BultenEmailModel({ bultenEmail: req.body.bultenemail });
            const sonuc = await userbulten.save();
            console.log(sonuc);
            if (sonuc) {
                res.send({ status: true })
            }
        }else{
            res.send({ duplikey: true })
        }

    }

}

module.exports = {
    showIndexPage,
    showShopPage,
    showShopCategoryPage,
    registerBulten
}