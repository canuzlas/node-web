const { body } = require('express-validator')


const registerValidate = () => {
    return [
        body('ad')
            .trim()
            .isLength({ min: 2, max: 20 }).withMessage('Ad en az 2 en fazla 20 karakter olmalıdır.'),
        body('soyad')
            .trim()
            .isLength({ min: 2, max: 30 }).withMessage('SoyAd en az 2 en fazla 30 karakter olmalıdır.'),
        body('email')
            .trim()
            .isEmail().withMessage('Lütfen geçerli bir mail türü girin.'),
        body('pass')
            .trim()
            .isLength({ min: 6, max: 20 }).withMessage('Şifreniz en az 6 en fazla 20 karakter olmalıdır.'),
        body('repass')
            .trim()
            .custom((value, { req }) => {
                if (value != req.body.pass) {
                    throw new Error('Şifreler aynı değil.')
                }
                return true
            })
    ]
}
const loginValidate = () => {
    return [
        body('email')
            .trim()
            .isEmail().withMessage('Lütfen geçerli bir mail türü girin.'),
        body('pass')
            .trim()
            .isLength({ min: 6, max: 20 }).withMessage('Şifreniz en az 6 karakter olmalıdır.')
    ]
}
const forgotValidate = () => {
    return [
        body('email')
            .trim()
            .isEmail().withMessage('Lütfen geçerli bir mail türü girin.')
    ]
}
const forgotPassValidate = () => {
    return [
        body('pass')
            .trim()
            .isLength({ min: 6, max: 20 }).withMessage('Şifreniz en az 6 en fazla 20 karakter olmalıdır.'),
        body('repass')
            .trim()
            .custom((value, { req }) => {
                if (value != req.body.pass) {
                    throw new Error('Şifreler aynı değil.')
                }
                return true
            })
    ]
}
const bultenEmailCheck = () => {
    return [
        body('bultenemail')
            .trim()
            .isEmail().withMessage('Lütfen geçerli bir mail türü girin.')
    ]
}
const payformValidate = () => {
    return [
        body('siparisAd')
            .trim()
            .isLength({ min: 3, max: 20 }).withMessage('Ad en az 3 en fazla 20 karakter olmalıdır.'),
        body('siparisSoyad')
            .trim()
            .isLength({ min: 3, max: 20 }).withMessage('SoyAd en az 3 en fazla 20 karakter olmalıdır.'),
        body('siparisEmail')
            .trim()
            .isEmail().withMessage('Lütfen geçerli bir mail türü girin.'),
        body('siparisGsm')
            .trim()
            .isNumeric().withMessage('Telefon numaranızı düzgün giriniz')
            .isLength({ min: 13, max: 20 }).withMessage('Telefon numaranız +90 la başlamalı.'),
        body('siparisAdres')
            .trim()
            .isLength({ min: 10, max: 50 }).withMessage('Sipariş adresi en az 10 karakter olmalı en fazla 50.'),
        body('siparisİl')
            .trim()
            .isLength({ min: 3, max: 50 }).withMessage('Sipariş ili en az 3 karakter olmalı en fazla 15.'),
        body('siparisUlke')
            .trim()
            .isLength({ min: 3, max: 50 }).withMessage('Sipariş ülkesi en az 3 karakter olmalı en fazla 15.'),
        body('siparisTC')
            .trim()
            .isNumeric().withMessage('TCK no hata.!')
            .isLength({ min: 11, max: 50 }).withMessage('TCK no en az 11 hane olmalı.')
    ]
}

module.exports = {
    registerValidate,
    loginValidate,
    forgotValidate,
    forgotPassValidate,
    bultenEmailCheck,
    payformValidate
}