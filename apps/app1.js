const express = require('express');
const router = express.Router();


// Define routes for app1
router.get('/', async (req, resp) => {
    resp.json({ message: 'This is app1' })
})

module.exports = router;