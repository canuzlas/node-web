const User = require('../models/user_model');

const showApiIndexPage = (req, res) => {
    res.json({
        mesaj: 'Hoşgeldin.',
        içerik: '/api/users pathinden tüm userlara erişebilirsiniz.',
        params: '/:id'
    })
}

const getAllUsers = async (req, res) => {

    if (req.params.id) {
        const _user = await User.findById(req.params.id, (err, doc) => {
            if (err) {
                res.json({
                    status: '404',
                    errorType: 'not find user',
                    mesaj: 'Kullanıcı Bulunamadı'
                })
            }
        }).select({ _id: 0, ad: 1, soyad: 1, email: 1, aktif: 1, avatar: 1 })
        if (_user) {
            res.json({
                data: _user
            })
        }else{
            res.json({
                status: '404',
                errorType: 'not find user',
                mesaj: 'Kullanıcı Bulunamadı'
            })
        }
    } else {
        const _users = await User.find({},(err, doc) => {
            if (err) {
                res.json({
                    status: '404',
                    errorType: 'not find users',
                    mesaj: 'Şuanda gösterilecek bir user bulunamamakta'
                })
            }
        }).select({ _id: 0, ad: 1, soyad: 1, email: 1, aktif: 1, avatar: 1 })
        if (_users) {
            res.json({
                data: _users
            })
        } else {
            res.json({
                status: '404',
                errorType: 'not find users',
                mesaj: 'Şuanda gösterilecek bir user bulunamamakta'
            })
        }

    }

}

module.exports = {
    showApiIndexPage,
    getAllUsers
}