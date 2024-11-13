const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

function connectToDatabase() {
    const url = process.env.MONGO_DB_EXAMPLE ?? '';
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

// Define models using the dbConnection (make the name end in s otherwise the mongodb shits itself and creates false db's)
const Info = dbConnection.model('infos', {
    header: { type: String, required: true },
    text: { type: String, required: true },
    photo: { type: String, required: false }
});

//kys
// Define routes
router.get('/info', async (req, resp) => {
    resp.json({ message: 'backend for spanish test from chapter 2' });
});

router.get('/', async (req, resp) => {
    try {
        const info = await Info.find().exec();
        resp.json(info);
    } catch (error) {
        resp.status(500).json({ error: 'Failed to fetch lessons' });
    }
});

router.get('/id/:id', async (req, resp) => {
    try {
        const info = await Info.findById(req.params.id).exec();
        resp.json(info);
    } catch (error) {
        resp.status(500).json({ error: `Failed to search for ${req.params.id}`});
    }
});

router.get('/prompt/:prompt', async (req, resp) => {
    try {
        const info = await Info.find({
            $or: [
              { header: { $regex: req.params.prompt, $options: 'i'} },
              { text: { $regex: req.params.prompt, $options: 'i' } }
            ]
          }).exec();
        resp.json(info);
    } catch (error) {
        resp.status(500).json({ error: `Failed to search for info with ${req.params.prompt}` });
    }
});

router.post('/:pass', async (req, resp) => {
    try {
        if(req.params.pass === process.env.DB_EDIT_PASS ?? ''){
            try {
                const info = new Info(req.body)
                await info.save()
                resp.status(201).json(info)
            } catch (error) {
                resp.status(400).json({ message: error.message })
            }
        }
        else{
            resp.status(401).json({ message: "incorrect database access password" })
        }
    }
    catch (error) {
        resp.status(400).json({ message: error.message })
    }
})

router.delete('/:id/:pass', async (req, resp) => {
    try {
        if(req.params.pass === process.env.DB_EDIT_PASS ?? ''){
            try {
                await Info.findByIdAndDelete(req.params.id)
                //to że no content to dobrze, bo tak sie robi zostaw 204
                resp.status(204).send()

            } catch (error) {
                resp.status(400).json({ message: error.message })
            }
        }
        else{
            resp.status(401).json({ message: "incorrect database access password" })
        }
    }
    catch (error) {
        resp.status(400).json({ message: error.message })
    }
})


router.put('/:id/:pass', async (req, resp) => {
    try {
        if(req.params.pass === process.env.DB_EDIT_PASS ?? ''){
            try {
                const info = await Info.findByIdAndUpdate(req.params.id, req.body)
                resp.status(200).json(info)
            } catch (error) {
                resp.status(400).json({ message: error.message })
            }
        }
        else{
            resp.status(401).json({ message: "incorrect database access password" })
        }
    }
    catch (error) {
        resp.status(400).json({ message: error.message })
    }
    
})




module.exports = router;