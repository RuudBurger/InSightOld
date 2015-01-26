var fs = require('fs'),
	path = require('path'),
	log = createLogger(__filename);

var controllers = {};

module.exports = function(app){
	var controller_dir = __dirname + '/controllers';

	// Load controller folder
	fs.readdirSync(controller_dir).forEach(function(file){
		var route_fname = controller_dir + '/' + file,
			route_name = path.basename(route_fname, '.js');

		if(route_name[0] !== '.'){
			var controller = require(route_fname);
			controller.setup(app);

			controllers[route_name] = controller;
		}
	});

	// Add catch all
	app.get('*', function(req, res){
		res.status(404).send('Your shoe\'s untied');
	});

	// Log errors resulting in 500
	app.use(function(err, req, res, next){
		if (err.name === 'UnauthorizedError') {
			res.status(401).send({'message': 'Invalid token'});
		}
		else {
			log.error(req.url + ': ' + err.stack);
			res.status(500).send({'message': 'Ohoh!'});
		}
	});

}
