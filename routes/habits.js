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


//@desc Show single habit
// @route   GET /habits/id:
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let habit = await Habit.findById(req.params.id)
        .populate('user')
        .lean()

        if (!habit) {
            return res.render ('error/404')
        }

        res.render('habits/show', {
            habit
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})

//@desc Show edit page
// @route   GET /habits/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
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
} catch (err) {
    console.error(err)
    return res.render('error/500')
}
})

//@desc Update Habit
// @route   PUT /habits/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try{
    let habit = await Habit.findById(req.params.id).lean()

    if (!habit) {
        return res.render('error/404')
    }

    if (habit.user != req.user.id){
        res.redirect('/habits')
    } else {
        habit = await Habit.findOneAndUpdate({ _id: req.params.id}, req.body, {
            new: true,
            runValidators: true,
        })

        res.redirect('/dashboard')
    }
} catch (err) {
    console.error(err)
    return res.render('error/500')
}
})

//@desc Delete habit
// @route   DELETE /habits/:id
router.delete('/:id', ensureAuth, async(req, res) => {
    try { 
        await Habit.deleteOne({ _id: req.params.id })
        res.redirect('/dashboard')
    }catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

//@desc User Habits
// @route   GET /habits/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const habits = await Habit.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('habits/index', {
            habits
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


module.exports = router