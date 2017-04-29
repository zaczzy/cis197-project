var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/project', function (err) {
  if (err && err.message.includes('ECONNREFUSED')) {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('DB successfully connected.');
  }
});

var userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  admin: Boolean
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

userSchema.statics.addUser = function (username, password, isAdmin, cb) {
  if (!isAdmin) {
    var newUser = new this({username: username, password: password, admin: isAdmin});
    newUser.save(cb);
  } else {
    this.findOne({admin: true}, function (err, user) {
      if (err) cb(err);
      if (!user) {
        var newUser = new this({username: username, password: password, admin: isAdmin});
        newUser.save(cb);
      } else {
        cb('An admin already exists!')
      }
    }.bind(this))
  }
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

userSchema.statics.setAdminPassword = function (username, password, isAdmin, cb) {
  this.findOne({admin: isAdmin}, function (err, user) {
    user.password = password;
    user.save(cb)
  });
};

module.exports = {
  mongoose: mongoose,
  userSchema: userSchema
};
