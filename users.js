var helpers = require('./helpers')
var express = require('express')
var router = express.Router()

router.all('/:username', function(req, res, next) {
  console.log(req.method, 'for', req.params.username)
  next()
})

router.get('/*.json', function(req, res) {
  res.download('./' + req.path)
})

router.get('/:username', helpers.verifyUser, function(req, res) {
  var username = req.params.username
  var user = helpers.getUser(username)
  res.render('user', {user: user, address: user.location})
})

router.put('/:username', function(req, res) {
  var username = req.params.username
  var user = helpers.getUser(username)
  user.location = req.body
  helpers.saveUser(username, user)
  res.end()
})

router.delete('/:username', function(req, res) {
  helper.deleteUser(req.params.username)
  res.sendStatus(200)
})

module.exports = router;
