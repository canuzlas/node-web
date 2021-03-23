const multer = require('multer');
const path = require('path');

const myMulterStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../uploads/admin'))
    },

    filename: function (req, file, cb) {
        const fileName = Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    }
})

const myMulterFileFilter = function (req, file, cb) {
   if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg' ||file.mimetype == 'video/mp4')
        cb(null,true)
        else
        req.flash('auth_errors',[{msg:'Yalnızca jpeg|jpg|png türü yükleyin'}])
        cb(null,false)
}

const upload = multer({storage:myMulterStorage,fileFilter:myMulterFileFilter});

module.exports = upload