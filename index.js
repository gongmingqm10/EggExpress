var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var express = require('express')
var engines = require('consolidate')
var bodyParser = require('body-parser')

var app = express()

app.set('views', './views')

//app.set('view engine', 'jade')
app.engine('hbs', engines.handlebars)
app.set('view engine', 'hbs')

app.use('/profilepics', express.static('images'))

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req, res) {
  var users = []

  fs.readdir('users', function(err, files) {
    files.forEach(function(file) {
      fs.readFile(path.join(__dirname, 'users', file), {encoding: 'utf8'}, function(err, data) {
        var user = JSON.parse(data)
        user.name.full = _.startCase(user.name.first + ' ' + user.name.last)
        users.push(user)

        if (users.length === files.length) res.render('index', {users: users})
      })
    })
  })
})

app.all('/users/:username', function(req, res, next) {
  console.log(req.method, 'for', req.params.username)
  next()
})

app.get('/data/:username', function(req, res) {
  var username = req.params.username
  var user = getUser(username)
  res.json(user)
})

// Should put before /users/:username, otherwise will be interupted by verifyUser()
app.get('/users/*.json', function(req, res) {
  res.download('./' + req.path)
})

app.get('/users/:username', verifyUser, function(req, res) {
  var username = req.params.username
  var user = getUser(username)
  res.render('user', {user: user, address: user.location})
})

app.put('/users/:username', function(req, res) {
  var username = req.params.username
  var user = getUser(username)
  user.location = req.body
  saveUser(username, user)
  res.end()
})

app.delete('/users/:username', function(req, res) {
  var fq = getUserFilePath(req.params.username)
  fs.unlinkSync(fq)
  res.sendStatus(200)
})

app.get('/not_found/:username', function(req, res) {
  res.status(404).send('WHOOPS!!! No user named: ' + req.params.username)
})

var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port)
})



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
