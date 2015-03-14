var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var db   = require('mongoose');
db.connect('mongodb://localhost:27017/trafficmtl'); // connect to our database
var Bridge     = require('./app/models/bridge');
var Coordinate     = require('./app/models/coordinate');

// API ROUTES
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Request received.');
	// use utf-8 charset
	res.header("Content-Type", "application/json; charset=utf-8");
	res.charset = 'utf-8';
	next();
});

router.get('/', function(req, res) {
	res.json({ message: 'Traffic Montreal API' });	
});

router.route('/bridges')
	.get(function(req, res) {
		Bridge.find(function(err, bridges) {
			if (err)
				res.send(err);
			res.json(bridges);
		});
	});

router.route('/bridges/:bridge_id')
	.get(function(req, res) {
		Bridge.findById(req.params.bridge_id, function(err, bridge) {
			if (err)
				res.send(err);
			res.json(bridge);
		});
	})

router.route('/coordinates')
	.get(function(req, res) {
		Coordinate.find(function(err, coords) {
			if (err)
				res.send(err);
			res.json(coords);
		});
	});

router.route('/update')
	.get(function(req, res) {
		Bridge.findById("55031ba37c2a7dae52fb18f2", function(err,bridge){
			if(err)
				res.send(err);
			res.json(bridge);
		})
	});

app.use('/api', router);

// Update Bridge data every minute
require('./regular_data_fetch');



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Starting server on port ' + port);
