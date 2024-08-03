const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')



const Lesson = mongoose.model('lesson', {
    theme: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    }
});


// Define routes for app1
router.get('/', async (req, resp) => {
    resp.json({ message: 'This is app1' })
})

router.get('/lessons', async (req, resp) => {
    resp.json(await Lesson.find().exec())
})

router.post('/lessons', async (req, resp) => {
    try {
        const lesson = new Lesson(req.body)
        await lesson.save()
        resp.status(201).json(lesson)
    } catch (error) {
        resp.status(400).json({ message: error.message })
    }
})

module.exports = router;