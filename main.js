require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
// const cors = require('cors') //to potrzeba przy łączeniu z frontem pamientaj

function connectToDatabase() {
    const url = process.env.MONGO_DB ?? ''
    
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

// Import routes for each app
// const app1Routes = require('./app1/routes/index');
// const app2Routes = require('./app2/routes/index');
const app1Route = require('./apps/app1');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


connectToDatabase()

// Use routes for each app
// app.use('/app1', app1Routes);
// app.use('/app2', app2Routes);
app.use('/app1', app1Route);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;