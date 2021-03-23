const mongoose = require('mongoose')

mongoose.connect(process.env.DataBase,{useCreateIndex:true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false})
        .then(succces => console.log('DB bağlandı'))
        .catch(err => console.log('DB bağlantı hata'))