var express = require('express')
var engines = require('consolidate')
var bodyParser = require('body-parser')
var helpers = require('./helpers')

var app = express()

app.set('views', './views')

//app.set('view engine', 'jade')
app.engine('hbs', engines.handlebars)
app.set('view engine', 'hbs')

app.use('/profilepics', express.static('images'))

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req, res) {
  res.render('index', {users: helpers.listUsers()})
})


app.get('/data/:username', function(req, res) {
  var username = req.params.username
  var user = helpers.getUser(username)
  res.json(user)
})

app.get('/not_found/:username', function(req, res) {
  res.status(404).send('WHOOPS!!! No user named: ' + req.params.username)
})

app.get('/users/*.json', function(req, res) {
  res.download('./' + req.path)
})

app.route('/users/:username')
  .all(function(req, res, next) {
    console.log(req.method, 'for', req.params.username)
    next()
  })
  .get(helpers.verifyUser, function(req, res) {
    var username = req.params.username
    var user = helpers.getUser(username)
    res.render('user', {user: user, address: user.location})
  })
  .put(function(req, res) {
    var username = req.params.username
    var user = helpers.getUser(username)
    user.location = req.body
    helpers.saveUser(username, user)
    res.end()
  })
  .delete(function(req, res) {
    var fq = getUserFilePath(req.params.username)
    fs.unlinkSync(fq)
    res.sendStatus(200)
  })

var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port)
})
