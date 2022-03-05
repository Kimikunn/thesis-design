# 毕设

## 一、管理平台

### 1.准备工作

#### ①新建文件，引入依赖

##### package  npm init -y

##### express  npm i -S express@next

##### nodemon  npm i -d nodemon

##### mongoose npm i -S mongoose

#### ②使用插件

##### rest client+xxx.http方便测试

### 2.基本功能

#### ①新建入口文件app.js

##### 引入依赖，测试get、post

#### ②新建路由文件夹，放入路由文件

##### 引入路由

```js
//app.js
app.use('',require(''))
```

##### 在路由文件中引入express、导出路由

```js
//route.js
const express = require('express')
const router = express.Router()
router.get('',()=>)
module.exports = router
```

#### ③新建view文件夹，页面使用ejs模板

##### 引入依赖，使用中间件

```js
//app.js
const expressLayouts = require('express-ejs-layouts')
npm i -s express-ejs-layouts ejs
app.use(expressLayouts)
app.set('view engine', 'ejs')
```

```ejs
<!--注册页register.ejs-->
<!--value使页面刷新后框内保持原先输入-->
<input type="name" class="form-control" placeholder="用户名" name='name' id="name"
           value="<%= typeof name != 'undefined' ? name : '' %>">
```

#### ④新建config文件夹，连接数据库

```js
//app.js
const mongoose = require('mongoose')
```

```js
//config/keys.js
module.exports = {
    MongoURI: "mongodb://127.0.0.1:27017/project"
}
```

```js
//app.js
//DB config
const db = require('./config/keys').MongoURI
//Connect to MongoDB
mongoose.connect(db)
    .then(console.log('MongoDB connected...'))
    .catch(err => console.log(err))
//☆Promise☆
```

#### ⑤新建models文件夹，建立Schema和Model

```js
//models/User.js
const mongoose = require('mongoose')
const UserSchama = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: date,
        default: Date.now
    }
})
const User = mongoose.model('User', UserSchama)
module.exports = User
```

##### ★需要body-parser中间件

```js
//app.js
app.use(express.urlencoded({ extended: false }))
//要放在路由中间件的上方！
```

### 3.注册功能

#### ①数据

name、email、password、password2

#### ②检查

必填项的验证、两次输入密码的匹配、密码长度

```js
//routes/users.js
const { name, email, password, password2 } = req.body
    let errors = []
    //Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: '请写入必填项！' })
    }
    //Check passwords match
    if (password !== password2) {
        errors.push({ msg: '两次输入的密码不一致！' })
    }
    //Check passwords length
    if (password.length < 6) {
        errors.push({ msg: '密码必须大于6个字符' })
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
        res.send('注册成功')
    }
```

#### ③新建partials文件夹，放入模板小组件

```ejs
<!--views/partials/message.ejs-->
<% if(typeof errors !='undefined' ){ %>
    <% errors.forEach(function(error){ %>
        <%=error.msg %>
            <%}) %>
                <% } %>
```

```ejs
<!--views/xxx.ejs-->
<%- include ('./partials/message') %>
```

https://getbootstrap.com/docs/5.1/components/alerts/#dismissing

增加警告样式

```html
<!--bootstrap4.6-->
<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>Holy guacamole!</strong> You should check in on some of those fields below.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
```

#### ④优化验证

邮箱是否已被使用、密码加密

```js
//routes/users.js
//Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //User exists
                    errors.push({ msg: '邮箱已被注册！' })
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
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        }))
                }
            })
```

#### ⑤不同的信息提示

```js
//app.js 
const flash = require('connect-flash')
//Connect flash
app.use(flash())
//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})
```

```json
//routes/users.js
//在需要显示提示的地方
req.flash('success_msg', '注册成功！')
```

```ejs
<!--views/partials/message.ejs-->
<% if(success_msg!='' ){ %>
    <div class="alert alert-success alert-dismissible fade show" role="alert">
        <%=success_msg %>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
    </div>
<% } %>
<% if(error_msg!='' ){ %>
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <%=error_msg %>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
    </div>
<% } %>
```

### 4.Passport.js

#### ①引入依赖与中间件

```js
//app.js
const session = require('express-session')
```

[express-session - npm (npmjs.com)](https://www.npmjs.com/package/express-session)

```js
//Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
```

#### ②新建config/passport.js

```js
//config/passport.js
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
//User model
const User = require('../models/User')
module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //Match User
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: '此邮箱未注册！' })
                    }
                    //Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err
                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: '密码错误' })
                        }
                    })
                })
                .catch(err = console.log(err))
        })
    )
}
```

```js
//app.js
const passport = require('passport')
//Passport config
require('./config/passport')(passport)
//Passport middleware
app.use(passport.initialize())
app.use(passport.session())
```
```js
//config/passport.js
//passport序列化和反序列化
passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user)
        })
    })
```

#### ③登录功能

```js
//routes/users.js
const passport = require('passport')
//Login Handle
router.post('/login', (req, res) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})
```

```js
//app.js
//Global vars
res.locals.error = req.flash('error')
```

```ejs
<!--views/partials/message.ejs-->
<% if(error!='' ){ %>
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <%=error %>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
    </div>
<% } %>
```

#### ④进入首页

```js
//routes/dashboard.js
//dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})
```

#### ⑤登出功能

```js
//routes/users.js
//Logout Handle
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', '已注销')
    res.redirect('/users/login')
})
```

#### ⑥config/auth.js中间件便于登录验证

```js
//config/auth.js
module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash('error_msg', '请登录账户！')
        res.redirect('/users/login')
    }
}
```

```js
//routes/dashboard.js
//加上中间件验证
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    })
})
```

```ejs
<!--views/dashboard.ejs-->
<%= name %>
```

### 5.持续优化

#### ①网站图标

```html
<!-- icon -->
<link rel="icon" href="/public/img/favicon.png" type="image/x-icon">
```
#### ②dashboard修改
主要是删除不必要的页面
#### ③增加忘记密码功能
页面的post通常action自己！
可以通过redirect重定向

## 二、部署到服务器

### 1.购买服务器（阿里云）

#### 注：不要忘记添加端口开放！

### 2.使用宝塔面板便于管理

#### ①pm2管理软件

#### ②mongodb

#### ③nginx

### 3.上传文件

#### ①打包成tgz文件

#### ②上传至/www/wwwroot下解压为project文件夹

### 4.使用pm2管理软件运行程序

### 5.登录地址

[AdminLTE 3 | Log in](http://139.196.4.142:3000/users/login)

