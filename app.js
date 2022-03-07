const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/User')
const Code = require('./models/Code')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')


const app = express()

//Passport config
require('./config/passport')(passport)

//DB config
const db = require('./config/keys').MongoURI

//Connect to MongoDB
mongoose.connect(db)
    .then(console.log('MongoDB connected...'))
    .catch(err => console.log(err))

//Bodyparser
app.use(express.urlencoded({ extended: false }))

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//CookieParser middleware
app.use(cookieParser('SECRET'))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Connect flash
app.use(flash())

//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//Static
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/plugins', express.static(path.join(__dirname, 'plugins')))

//FindAll Users
app.get('/users', async (req, res) => {
    const users = await User.find()
    res.send(users)
})

//FindAll Codes
app.get('/codes', async (req, res) => {
    const codes = await Code.find()
    res.send(codes)
})

const port = 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})