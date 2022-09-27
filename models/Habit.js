const mongoose = require('mongoose')

const HabitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },
    body: {
        type: String,
        required: true
    },
    contentment: {
        type: String,
        description: 'does it bring contentment or discontentment',
        enum: ['discontentment', 'contentment']
    },
    self: {
        type: String,
        description: 'self-enrichment or self-centered',
        enum: ['self-enrichment', 'self-centered']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    body: {
        type: String,
        description: 'Examples of instances habit comes up',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Habit', HabitSchema)