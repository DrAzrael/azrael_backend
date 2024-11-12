const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

function connectToDatabase() {
    const url = process.env.MONGO_DB_EXAMPLE ?? '';
    const dbConnection = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });

    dbConnection.once('open', () => {
        console.log(`Database connected successfully`);
    });

    dbConnection.on('error', (err) => {
        console.error(`Connection error: ${err}`);
    });

    return dbConnection;
}

// Create a connection
const dbConnection = connectToDatabase();

// Define models using the dbConnection (make the name end in s otherwise the mongodb shits itself and creates false db's)
const Test = dbConnection.model('exmps', {
    data: { type: String, required: true }
});

// Define routes
router.get('/info', async (req, resp) => {
    resp.json({ message: 'This is the dir for the example backend' });
});

router.get('/test', async (req, resp) => {
    try {
        const test = await Test.find().exec();
        resp.json(test);
    } catch (error) {
        resp.status(500).json({ error: 'Failed to fetch lessons' });
    }
});

module.exports = router;