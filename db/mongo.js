var user = require('./user');
var mongoose = user.mongoose;

var reviewSchema = new mongoose.Schema({
  title: String,
  text: String
});

var Reviews = mongoose.model('Reviews', reviewSchema);
var User = mongoose.model('User', user.userSchema);
var db = mongoose.connection;

module.exports = {
  Reviews: Reviews,
  mongoose: mongoose,
  db: db.collection('User'),
  User: User
};
