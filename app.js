// Paths
global.paths = {
    'root': __dirname,
	'client': __dirname + '/client',
	'server': __dirname + '/server',
	'tmp': __dirname + '/.tmp',
	'data': __dirname + '/data',
	'react': __dirname + '/client/react'
};

// Load settings first
var Settings = require('settings');
global.settings = new Settings(require('./config'));

// Logs
global.createLogger = require('./server/logger').createLogger;

// Helpers
require('./server/helpers');

// Import modules
var express = require('express'),
    compress = require('compression'),
    bodyParser = require('body-parser'),

	// HTTP server
	http = require('http'),
	cors = require('cors'),

	// Logging
	winston = require('winston'),

	// Server
	app = express();

// Globalize stuff
global.db = require('./server/db');
global.api = require('./server/api');

// Reset some stuff first
app.disable('x-powered-by');

// CORS middleware
app.use(cors({origin: settings.cors_origin}));
app.options('*', cors());

// Add middleware
app.use(compress());
app.use(bodyParser.urlencoded({'extended': true}))
app.use(bodyParser.json({'limit': '50mb'}));

// Static paths
app.use(express.static(paths.client));
app.use(express.static(paths.tmp));
app.use('/data', express.static(paths.data));

// Use proper IP
app.enable('trust proxy');

var log = global.createLogger(__filename);

// Don't accept new incoming connections when restarting
var shutting_down = false;
app.use(function(req, res, next) {
	if (!shutting_down)
		return next();
	res.setHeader('Connection', 'close');
	return res.send(502, 'Server is in the process of restarting');
});

// Start socket server
//var socketio = require('socket.io'),
//	socketjwt = require('socketio-jwt'),
//	io = socketio.listen(server);
//
//io.set('authorization', socketjwt.authorize({
//	secret: settings.jwt_secret,
//	handshake: true
//}));
//
//io.on('connection', function (socket) {
//	log.info('socket connection');
//	console.log(socket.client.request.decoded_token.email, 'connected');
//});

global.ReactRoutes = require('react-router');

// Configure RequireJS
global.requirejs = require('requirejs');
requirejs.config({
    baseUrl: paths.root,
    paths: {
        'r': paths.root + '/.tmp/react',
        'js': paths.client + '/scripts',
        'vendor': paths.client + 'scripts/vendor'
    },
    nodeRequire: require
});

// Route
require('./server/routes')(app);

// Start server
var httpServer = app.listen(process.env.PORT || 3000);

//// Graceful shutdown
var graceful = function() {
	shutting_down = true;

	httpServer.close(function() {
		winston.info('Closed out remaining connections.');
		return process.exit();
	});

	return setTimeout(function() {
		winston.error('Could not close connections in time, forcefully shutting down');
		return process.exit(1);
	}, 30 * 1000);
}

// Graceful shutdown
process.on('SIGTERM', function(){
	winston.info('Received kill signal (SIGTERM), shutting down gracefully.');
	graceful();
});

// Try to log exceptions
process.on('uncaughtException', function (err) {
	winston.error(err.stack);
	graceful();
})
