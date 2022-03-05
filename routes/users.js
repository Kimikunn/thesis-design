const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const nodemailer = require('nodemailer')

//User model
const User = require('../models/User')

//Code Model
const Code = require('../models/Code')

//Register Page
router.get('/register', (req, res) => {
    res.render('register')
})

//Login Page
router.get('/login', (req, res) => {
    res.render('login')
})

//Forgot-password Page
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password')
})

//Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2, agreeTerms } = req.body
    let errors = []
    //Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: '请写入必填项！' })
    }
    else if (!agreeTerms) {
        errors.push({ msg: '请同意相关协议' })
    }
    //Check passwords match
    else if (password !== password2) {
        errors.push({ msg: '两次输入的密码不一致！' })
    }
    //Check passwords length
    else if (password.length < 6) {
        errors.push({ msg: '密码必须大于6个字符！' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        //Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //User exists
                    errors.push({ msg: '此邮箱已被注册！' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    //Hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //Set password to hashed
                            newUser.password = hash;
                            //Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', '注册成功，请登录！')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        }))
                }
            })
    }
})

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', '已注销！')
    res.redirect('/users/login')
})

//Forgot-password Handle
router.post('/forgot-password', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                let code = Math.floor(Math.random() * 900000) + 100000
                let options = {
                    from: '1042806282@qq.com',
                    to: req.body.email,
                    subject: '欢迎使用上海大学账户密码修改系统！',
                    html: `<!DOCTYPE html>
                    <html lang="en">
                    
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                    </head>
                    
                    <body>
                        <div style="width: 600px;margin: 30px auto">
                            <h1 style="text-align:center">欢迎使用上海大学账户密码修改系统！</h1>
                            <p style="font-size: 24px;">验证码如下：</p>
                            <strong style="font-size: 20px;display: block;text-align: center;color: rgb(163, 24, 24);">${code}</strong>
                            <p>此邮件为系统自动发送，请勿回复，若您没有进行过注册则忽略本条。</p>
                        </div>
                    </body>
                    
                    </html>`
                }
                const newCode = new Code({
                    code
                })
                newCode.email = req.body.email
                newCode.code = code
                newCode.save()

                console.log(code);
                let transporter = nodemailer.createTransport({
                    host: 'smtp.qq.com',
                    port: 465,
                    auth: {
                        user: '1042806282@qq.com',
                        pass: 'ccjnnlsfgompbbhj'
                    }
                })

                transporter.sendMail(options, (err, msg) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.render('recover-password', {
                            email: req.body.email,
                        })
                        transporter.close()
                    }
                })
            } else {
                req.flash('error_msg', '该邮箱未注册！')
                res.redirect('forgot-password')
            }
        })

})

//Recover-password Handle
router.post('/recover-password', (req, res) => {
    const { email, code, password, password2 } = req.body
    let errors = []
    Code.findOne({ email: email }).sort({ _id: -1 }).limit(1)
        .then(code => {
            if (code) {
                const codeCheck = code.code
                //Check required fields
                if (!email || !code || !password || !password2) {
                    errors.push({ msg: '请写入必填项！' })
                }
                //Check passwords match
                if (password !== password2) {
                    errors.push({ msg: '两次输入的密码不一致！' })
                }
                //Check passwords length
                if (password.length < 6) {
                    errors.push({ msg: '密码必须大于6个字符！' })
                }
                //Check code
                if (code.code != codeCheck) {
                    errors.push({ msg: '验证码错误！' })
                }
                if (errors.length > 0) {
                    res.render('recover-password', {
                        errors,
                        email,
                        password,
                        password2
                    })
                } else {
                    User.findOne({ email: email })
                        .then(user => {
                            //Hash password
                            bcrypt.genSalt(10, (err, salt) =>
                                bcrypt.hash(password, salt, (err, hash) => {
                                    if (err) throw err;
                                    //Set password to hashed
                                    user.password = hash;
                                    //Save user
                                    user.save()
                                        .then(user => {
                                            req.flash('success_msg', '密码修改成功，请登录！')
                                            res.redirect('/users/login')
                                        })
                                        .catch(err => console.log(err))
                                }))
                        })
                }
            } else {
                err => console.log(err);
            }

        })

})

module.exports = router
