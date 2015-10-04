/**
 * Module dependencies.
 */
var express = require('express')
var config = {
  google: {
    'returnURL':'hello',
    'realm': 'fuck'    
  },
};
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var routes = require('./routes');
var app = module.exports = express.createServer();

/* Passport stuff */
// serialize and deserialize
passport.serializeUser(function(user, done) {
done(null, user);p
});
passport.deserializeUser(function(obj, done) {
done(null, obj);
});


// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.cookieParser())
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session( { secret: '8632248974' }))
  app.use(passport.initialize());
  app.use(passport.session())
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


/* MongoDB Connection */
var url = 'mongodb://localhost:1337/frontend';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  app.listen(3000, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  });  

  // Mongo Collections
  var People = db.collection('Person');
  var NGOS = db.collection('NGO');

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function(){
    app.use(express.errorHandler());
  });

  // Routes
  app.get('/', routes.index);

  // Routes to add a person
  app.get('/add/p', routes.addPerson);
  app.post('/add/p', routes.submitPerson);
  // Display Person Information page
  app.get('/p/:person_id', routes.person);

  // Routes to add an NGO
  app.get('/add/org', routes.addNGO);
  app.post('/add/org', routes.submitNGO);
  // Display NGO Information page
  app.get('/n/:ngo_id', routes.NGO)
});


// serialize and deserialize
passport.serializeUser(function(user, done) {
 console.log('serializeUser: ' + user._id)
 done(null, user._id);
});
passport.deserializeUser(function(id, done) {
 User.findById(id, function(err, user){
     console.log(user)
     if(!err) done(null, user);
     else done(err, null)
 })
});

passport.use(new GoogleStrategy({
 returnURL: config.google.returnURL,
 realm: config.google.realm
},
function(identifier, profile, done) {
 process.nextTick(function () {
   profile.identifier = identifier;
   return done(null, profile);
 });
}
));

// Routes
app.get('/', routes.index);
//Passport routes
app.get('/ping', routes.ping);
app.get('/account', ensureAuthenticated, function(req, res){
User.findById(req.session.passport.user, function(err, user) {
 if(err) {
   console.log(err);
 } else {
   res.render('account', { user: user});
 };
});
});

app.get('/', function(req, res){
res.render('login', { user: req.user });
});

app.get('/auth/facebook',
passport.authenticate('facebook'),
function(req, res){
});
app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '' }),
function(req, res) {
 res.redirect('/account');
});

app.get('/auth/google',
  passport.authenticate('google'),
  function(req, res){
  });
  app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
  res.redirect('/account');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});