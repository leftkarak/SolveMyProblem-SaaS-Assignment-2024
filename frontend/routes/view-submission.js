const express = require('express');
const path = require('path');
const router = express.Router();

// Access email in session
router.get('/get-email', (req, res) => {

    if (req.session.email && req.session.creator && req.session.submission) {
        res.json({
            email: req.session.email,
            creator: req.session.creator,
            submission: req.session.submission
        });

    } else {
        res.status(401).json({ error: 'Not logged in' });
    }

    req.session.creator = undefined;
    req.session.submission = undefined;
})

// GET Route for loading SUBMISSIONS
router.get('/:creator/:submission', (req, res) => {

    // If session is empty
    if (!req.session.email) {
        return res.redirect('/login');
    }

    req.session.creator = req.params.creator;
    req.session.submission = req.params.submission;

    // Load html
    res.sendFile(path.join(__dirname, '../views/view_edit.html'));
})

// Making ROUTER available for import in other files
module.exports = router;