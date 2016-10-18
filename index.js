var fs = require('fs')
var express = require('express')
var engines = require('consolidate')
var bodyParser = require('body-parser')

var helpers = require('./helpers')
var userRouter = require('./users')

var app = express()

app.use(bodyParser.urlencoded({extended: true}))

app.set('views', './views')
//app.set('view engine', 'jade')
app.engine('hbs', engines.handlebars)
app.set('view engine', 'hbs')

app.use('/profilepics', express.static('images'))

app.use('/users', userRouter)

app.get('/', function(req, res) {
  res.render('index', {users: helpers.listUsers()})
})

app.get('/data/:username', function(req, res) {
  var username = req.params.username
  var readable = fs.createReadStream('./users/' + username + '.json')
  readable.pipe(res)
})

app.get('/not_found/:username', function(req, res) {
  res.status(404).send('WHOOPS!!! No user named: ' + req.params.username)
})

var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port)
})
