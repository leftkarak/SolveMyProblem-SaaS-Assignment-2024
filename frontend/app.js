const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname+'public/css'))
app.use('/js', express.static(__dirname+'public/js'))
app.use('/img', express.static(__dirname+'public/img'))

// Session Configuration
app.use(session({
    secret: "my secret key",
    resave: true,
    saveUninitialized: true
}));

// Declare routes
const loginRoute = require('./routes/login.js');
const submissionsRoute = require('./routes/submissions.js');
const creditsRoute = require('./routes/credits.js');
const createRoute = require('./routes/create-submission.js');
const viewRoute = require('./routes/submission.js');
const resultsRoute = require('./routes/results.js');
const analyticsRoute = require('./routes/analytics.js');

// Declare action on URL
app.use('/login', loginRoute);
app.use('/submissions', submissionsRoute);
app.use('/credits', creditsRoute);
app.use('/create-submission', createRoute);
app.use('/submission', viewRoute);
app.use('/results', resultsRoute);
app.use('/analytics', analyticsRoute);

// GET to build login page
app.get('', (req, res) => {
    res.redirect('/login');
})

// Start server on frontend port (3000)
app.listen(port, () => {
    // Notify on running ms
   console.log("MS frontend running at http://localhost:3000");
});