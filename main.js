require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
// const cors = require('cors') //to potrzeba przy łączeniu z frontem pamientaj



// Import routes for each app
// const app1Routes = require('./app1/routes/index');
// const app2Routes = require('./app2/routes/index');
// const app1Route = require('./apps/app1');
const exampleRoute = require('./apps/example_backend');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




// Use routes for each app
// app.use('/app1', app1Routes);
// app.use('/app2', app2Routes);
// app.use('/app1', app1Route);
app.use('/example', exampleRoute)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;