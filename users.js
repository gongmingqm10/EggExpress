var express = require('express')
var User = require('./db').User

var router = express.Router()

router.all('/:username', function(req, res, next) {
  console.log(req.method, 'for', req.params.username)
  next()
})

router.get('/:username', function(req, res) {
  var username = req.params.username
  User.findOne({username: username}, function(err, user) {
    res.render('user', {user: user, address: user.location})
  })
})

router.put('/:username', function(req, res) {
  var username = req.params.username

  User.findOne({username: username}, function(err, user) {
    user.name.full = req.body.name
    user.location = req.body.location
    user.save(function() {
      res.end()
    })
  })
})

router.delete('/:username', function(req, res) {
  User.remove({username: req.params.username}, function(err) {
    if (!err) {
      res.sendStatus(200)
    }
  })
})

router.get('/by/:gender', function(req, res) {
  var gender = req.params.gender

  User.find({gender: gender}).limit(10000).exec(function(err, users) {
    res.json(users)
  })
})

module.exports = router;
