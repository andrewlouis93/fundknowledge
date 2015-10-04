/**
 * Module dependencies.
 */
var express = require('express')
var routes = require('./routes');
var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
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




