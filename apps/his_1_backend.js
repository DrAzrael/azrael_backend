const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

function connectToDatabase() {
    const url = process.env.MONGO_DB_HIS ?? '';
    const dbConnection = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });

    dbConnection.once('open', () => {
        console.log(`Database ${url} connected successfully`);
    });

    dbConnection.on('error', (err) => {
        console.error(`Connection error: ${err}`);
    });

    return dbConnection;
}

// Create a connection
const dbConnection = connectToDatabase();

// Define models using the dbConnection
const Lesson = dbConnection.model('lesson', {
    theme: { type: String, required: true },
    notes: { type: String, required: true }
});

const Note = dbConnection.model('note', {
    title: { type: String, required: true },
    notes: { type: String, required: true }
});

// Define routes
router.get('/info', async (req, resp) => {
    resp.json({ message: 'This is the dir for the example backend' });
});

router.get('/lessons', async (req, resp) => {
    try {
        const lessons = await Lesson.find().exec();
        resp.json(lessons);
    } catch (error) {
        resp.status(500).json({ error: 'Failed to fetch lessons' });
    }
});

router.get('/notes', async (req, resp) => {
    try {
        const notes = await Note.find().exec();
        resp.json(notes);
    } catch (error) {
        resp.status(500).json({ error: 'Failed to fetch notes' });
    }
});

module.exports = router;