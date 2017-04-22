var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/cis197-project-data', function (err) {
  if (err && err.message.includes('ECONNREFUSED')) {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('DB successfully connected. Adding seed data...');
  }
});

var userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

userSchema.pre('save', function (next) {
  var user = this;
  
  if (!user.isModified('password')) return next();
  
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      
      user.password = hash;
      next();
    });
  });
});

userSchema.statics.addUser = function (username, password, cb) {
  var newUser = new this({username: username, password: password});
  newUser.save(cb);
};

userSchema.statics.checkIfLegit = function (username, password, cb) {
  this.findOne({username: username}, function (err, user) {
    if (err) cb(err);
    if (!user) cb('no user');
    else {
      bcrypt.compare(password, user.password, function (err, isRight) {
        if (err) return cb(err);
        cb(null, isRight);
      });
    }
  });
};

userSchema.statics.updateAdmin = function (username, password, cb) {
  this.find({name: username}, function (e, user) {
    if (e) cb(e);
    if (!user) cb('no user');
    else {
      user.password = password;
    }
    user.save(function (err) {
      if (err) throw err;
      console.log('Admin password successfully updated!');
    });
  });
};
var user = mongoose.model('User', userSchema);

module.exports = {
  mongoose: mongoose,
  user: user
};
