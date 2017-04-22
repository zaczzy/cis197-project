var User = require('./user');
var mongoose = User.mongoose;
var user = User.user;
var db = mongoose.connection;

var keySchema = new mongoose.Schema({
  key: String
});

var reviewSchema = new mongoose.Schema({
  className: String,
  semester: String,
  rating: Number,
  text: String
});

var Key = mongoose.model('Key', keySchema);
var Reviews = mongoose.model('Reviews', reviewSchema);

module.exports = {
  Key: Key,
  Reviews: Reviews,
  mongoose: mongoose,
  db: db.collection('Reviews'),
  user: user
};
