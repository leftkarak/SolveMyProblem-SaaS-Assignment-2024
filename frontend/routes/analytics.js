const express = require('express');
const path = require('path');
const router = express.Router();

// Access email in session
router.get('/get-email', (req, res) => {

    if (req.session.email) {
        res.json({ email: req.session.email });

    } else {
        res.status(401).json({ error: 'Not logged in' });
    }
})

// GET Route for loading SUBMISSIONS
router.get('/', (req, res) => {

    // If session is empty
    if (!req.session.email) {
        return res.redirect('/login');
    }

    // Load html
    res.sendFile(path.join(__dirname, '../views/analytics.html'));
})

module.exports = router;