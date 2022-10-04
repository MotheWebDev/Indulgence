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

//@desc Show all habits
// @route   GET /habits
router.get('/', ensureAuth, async (req, res) => {
    try{
        const habits = await Habit.find({ status: 'public'})
        .populate('user')
        .sort({ createdAt: 'desc'})
        .lean()

        res.render('habits/index', {
            habits,
        })
    }catch (err){
        console.log(err)
        res.render('error/500')
    }
})

//@desc Show edit page
// @route   GET /habits/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    const habit = await Habit.findOne({
        _id: req.params.id
    }).lean()

    if (!habit) {
        return res.render('error/404')
    }

    if (habit.user != req.user.id){
        res.redirest('habits')
    } else { res.render('habits/edit', {
        habit,
    }) 
}
})

module.exports = router