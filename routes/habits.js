const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Habit = require('../models/Habit')

//@desc Show add page
// @route   GET /habits/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('habits/add')
})

//@desc Process add form
// @route   POST /habits
router.post('/', ensureAuth, async (req, res) => {
    try{
        req.body.user = req.user.id
        await Habit.create(req.body)
        res.redirect('/dashboard')
    }catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
module.exports = router