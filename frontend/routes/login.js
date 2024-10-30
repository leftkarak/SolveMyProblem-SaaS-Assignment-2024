const express = require('express');
const path = require('path');
const router = express.Router();

// GET Route for loading LOGIN
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
})

// POST Route to get the submissions page
router.post('/', (req, res) => {

    // Save email in session
    req.session.email = req.body.email;

    // GET submissions request
    res.redirect('/submissions');
})

// Making ROUTER available for import in other files
module.exports = router;