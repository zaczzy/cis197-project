var express = require('express');
var app = express();
var uuid = require('node-uuid');
// Serve static pages
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

// Generate a random cookie secret for this app
var generateCookieSecret = function () {
  return 'iamasecret' + uuid.v4();
};

// (Part 3) - Use the cookieSession middleware. The above function
// can be used to generate a secret key. Make sure that you're not accidentally
// passing the function itself - you need to call it to get a string.
var cookieSession = require('cookie-session');
app.use(cookieSession({
  secret: generateCookieSecret(),
  maxAge: 60 * 60 * 1000
}));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
// Mount your routers. Please use good style here: mount a single router per use() call,
// preceded only by necessary middleware functions.
// DO NOT mount an 'authenticating' middleware function in a separate call to use().
// For instance, the API routes require a valid key, so mount checkValidKey and apiRouter in the same call.


var loginRouter = require('./routes/login');
app.use('/', loginRouter);

var keysRouter = require('./routes/keys');
app.use('/', keysRouter);

var checkValidKeyRouter = require('./middlewares/checkValidKey');
var apiRouter = require('./routes/api');
app.use('/api', checkValidKeyRouter, apiRouter);

var authenticateRouter = require('./middlewares/isAuthenticated');
var reviewRouter = require('./routes/reviews');
app.use('/reviews', authenticateRouter, reviewRouter);

// Mount your error-handling middleware.
// Please mount each middleware function with a separate use() call.
var errorRouter = require('./middlewares/handleError');
var pageNotFoundRouter = require('./middlewares/pageNotFound');
app.use(errorRouter);
app.use(pageNotFoundRouter);
module.exports = app;
