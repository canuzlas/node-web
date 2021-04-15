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

module.exports = {
    registerValidate,
    loginValidate,
    forgotValidate,
    forgotPassValidate,
    bultenEmailCheck
}