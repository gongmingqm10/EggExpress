var _ = require('lodash')

var uri = 'mongodb://localhost:27017/test'

var mongoose = require('mongoose')
mongoose.connect(uri)

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function(callback) {
  console.log('yay')
})

var userSchema = mongoose.Schema({
  username: String,
  gender: String,
  name: {
    title: String,
    first: String,
    last: String
  },
  location: {
    street: String,
    city: String,
    state: String,
    zip: String,
  }
})

userSchema.virtual('name.full').get(function () {
  return _.startCase(this.name.first + ' ' + this.name.last)
});

exports.User = mongoose.model('User', userSchema)
