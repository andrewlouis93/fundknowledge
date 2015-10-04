/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};
exports.addPerson = function(req, res){
	res.render('addPerson');
};
exports.addNGO = function(req, res){
	res.render('addNGO');
};

var url = 'mongodb://localhost:1337/frontend';
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');

MongoClient.connect(url, function(err, db) {
	 
	 var People, NGOs;
	try { People = db.collection('Person');
	NGOs = db.collection('NGO');
	} catch (e) {
	
}

	exports.person = function(req, res){
		var person_id = req.params.person_id;
		var _p = People.find({_id : ObjectId(person_id)}).toArray(function (err, data) {
		  // data[0] is your document here
		  console.log("in person")
		  console.log( data[0] );
		  res.render( 'person', { person: data[0] } );
		})
	};

	exports.NGO = function(req, res){
		var ngo_id = req.params.ngo_id;
		var ngo = NGOs.find({_id : ObjectId(ngo_id)}).toArray(function (err, data) {
		  // data[0] is your document here
		  console.log("in ngo")
		  console.log( data[0] );
		  res.render( 'ngo', { ngo: data[0] } );
		})
	};

	 exports.submitPerson = function(req, res){
		var person = {
			name: req.body.inputName, 
			twitter: req.body.inputTwitter,
			skype: req.body.inputSkype,
			age: req.body.age, 
			target: req.body.targetFunds,
			raised: 0,
			story: req.body.inputStory
		}
		People.insert(person);
		// FLASH MESSAGE
		res.redirect('/');
	};
  
	 exports.submitNGO = function(req, res){
		var NGO = {
			name: req.body.inputName, 
			email: req.body.inputEmail,
			twitter: req.body.inputTwitter,
		}
		NGOs.insert(NGO);
		// FLASH MESSAGE
		res.redirect('/');
	};

	exports.login = function(req, res){
		console.log("HEY");
		res.render('login');
	};

	exports.before = function(req, res){
		res.render('before');
	};

	exports.after = function(req, res){
		res.render('after');
	};	



});


