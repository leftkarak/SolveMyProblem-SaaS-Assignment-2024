const express = require('express');
const path = require('path');
const router = express.Router();
const multer = require('multer');

// Access email in session
router.get('/get-email', (req, res) => {

    if (req.session.email) {
        res.json({ email: req.session.email });

    } else {
        res.status(401).json({ error: 'Not logged in' });
    }
})

// GET Route for loading CREATE SUBMISSION
router.get('/', (req, res) => {

    // If session is empty
    if (!req.session.email) {
        return res.redirect('/login');
    }

    // Load html
    res.sendFile(path.join(__dirname, '../views/create-submission.html'));
})

// Making ROUTER available for import in other files
module.exports = router;