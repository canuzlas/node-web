const express = require('express');
const path = require('path');
const authRouter = require('./src/routes/auth_route');
const adminRouter = require('./src/routes/admin_route');
const apiRouter = require('./src/routes/api_route');
const googleAuthRouter = require('./src/routes/google_auth_router');
const facebookAuthRouter = require('./src/routes/facebook_auth_router');
const ejsLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const mongoStrore = require('connect-mongo')(session);
const passport = require('passport');
const app = express();
require('dotenv').config();
require('./src/config/data_base');

const mySessionStore = new mongoStrore({
    url: process.env.DataBase,
    collection: 'sessions'
})

app.use(session({
    secret: process.env.SessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    },
    store: mySessionStore
}))


app.use(flash());
app.use((req, res, next) => {
    res.locals.auth_errors = req.flash('auth_errors')
    res.locals.form_input = req.flash('form_input')
    res.locals.auth_success = req.flash('auth_success')
    res.locals.login_errors = req.flash('error')
    next()
})

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.use(express.static('./src/uploads/admin'));
app.use(express.static('./src/uploads/products'));

app.use(express.urlencoded({ extended: false }));

app.use(ejsLayout);
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src/views'));

app.use('/', authRouter);
app.use('/admin', adminRouter);
app.use('/api',apiRouter);
app.use('/auth/google',googleAuthRouter);
app.use('/auth/facebook',facebookAuthRouter);

app.use((req,res)=>{
    res.status(404).render('404',{layout:'layout/404_layout.ejs'})
})


app.listen(process.env.PORT, () => {
    console.log(process.env.PORT + " portundan dinlemede")
})