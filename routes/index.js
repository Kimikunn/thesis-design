const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')

//Index Page
router.get('/', (req, res) => {
    res.redirect('users/login')
})

//Privacy Page
router.get('/privacy', (req, res) => {
    res.render('privacy')
})

//Dashboard Page 
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    })
})

module.exports = router