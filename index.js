var express = require('express')
var engines = require('consolidate')
var bodyParser = require('body-parser')

var userRouter = require('./users')
var User = require('./db').User

var app = express()

app.use(bodyParser.urlencoded({extended: true}))

app.set('views', './views')
//app.set('view engine', 'jade')
app.engine('hbs', engines.handlebars)
app.set('view engine', 'hbs')

app.use('/profilepics', express.static('images'))

app.use('/users', userRouter)

app.get('/', function(req, res) {
  User.find({}, function(err, users) {
    res.render('index', {users: users})
  })
})

app.get('/data/:username', function(req, res) {
  var username = req.params.username
  User.findOne({username: username}, function(err, user) {
    res.json(user)
  })
})

app.get('/not_found/:username', function(req, res) {
  res.status(404).send('WHOOPS!!! No user named: ' + req.params.username)
})

var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port)
})
