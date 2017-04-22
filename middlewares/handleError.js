// Write the handleError middleware.
// This function must be an express error handling middleware

var handleError = function (error, req, res, next) {
  res.render('errorPage', {
    statusCode: res.statusCode,
    message: error.message,
    stackTrace: error.stack
  });
};


// Export the middleware function for use in app.js
module.exports = handleError;
