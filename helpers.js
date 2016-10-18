var fs = require('fs')
var path = require('path')
var _ = require('lodash')

function getUserFilePath(username) {
  return path.join(__dirname, 'users', username + '.json')
}

function getUser(username) {
  var user = JSON.parse(fs.readFileSync(getUserFilePath(username), {encoding: 'utf8'}))
  if (!user.name.full) {
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
  }
  _.keys(user.location).forEach(function(key) {
    user.location[key] = _.startCase(user.location[key])
  })
  return user
}

function saveUser(username, user) {
  var filePath = getUserFilePath(username)
  fs.unlinkSync(filePath) //delete the file
  fs.writeFileSync(filePath, JSON.stringify(user, null, 2), {encoding: 'utf8'})
}

function verifyUser(req, res, next) {
  var username = req.params.username
  var fp = getUserFilePath(username)
  fs.exists(fp, function(yes) {
    if (yes) {
      next()
    } else {
      res.redirect('/not_found/' + username)
    }
  })
}

function listUsers() {
  var users = []
  fs.readdirSync('users').forEach(function(file) {
    var rawData = fs.readFileSync(path.join(__dirname, 'users', file), {encoding: 'utf8'})
    var user = JSON.parse(rawData)
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
    users.push(user)
  })
  return users
}

function deleteUser(username) {
  var fq = getUserFilePath(username)
  fs.unlinkSync(fq)
}

module.exports = {
  getUserFilePath: getUserFilePath,
  getUser: getUser,
  saveUser: saveUser,
  verifyUser: verifyUser,
  listUsers: listUsers,
  deleteUser: deleteUser
}
