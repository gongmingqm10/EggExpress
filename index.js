var fs = require('fs')
var _ = require('lodash')
var express = require('express')
var app = express()
var users = []

fs.readFile('users.json', {encoding: 'utf8'}, function(err, data) {
  if (err) throw err
  JSON.parse(data).forEach(function(user) {
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
    users.push(user)
  })
  console.log('users.count = ' + users.length)
})

app.get('/', function(req, res) {
  var buffer = ''

  users.forEach(function(user) {
    buffer += '<a href = "' + user.username + '">' +  user.name.full + '</a><br>'
  })

  console.log("@@@@@@@@@@@@@" + buffer)
  res.send(buffer)
})


var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port)
})
