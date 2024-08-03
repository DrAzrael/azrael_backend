const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

function connectToDatabase() {
    const url = process.env.MONGO_DB_EXAMPLE ?? ''
    
    try {
        mongoose.connect(url, {})
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message)
        }
        process.exit(1)
    }
    const dbConnection = mongoose.connection
    dbConnection.once('open', () => {
        console.log(`Database connected`)
    })

    dbConnection.on('error', (err) => {
        console.error(`connection error: ${err}`)
    })
    return
}

connectToDatabase()

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
    resp.json({ message: 'This is the dir for the example backend' })
})

router.get('/lessons', async (req, resp) => {
    resp.json(await Lesson.find().exec())
})

router.get('/idsearch/:id', async (req, resp) => {
    resp.json(await Lesson.findById(req.params.id).exec())
})

router.get('/promptsearch/:prompt', async (req, resp) => {
    resp.json(await Lesson.find({
        $or: [
          { theme: { $regex: req.params.prompt, $options: 'i'} },
          { notes: { $regex: req.params.prompt, $options: 'i' } }
        ]
      }).exec())
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