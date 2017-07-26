/* eslint-disable no-console */

var http = require('http');
var express = require('express');
var application = express();
var bodyParser = require('body-parser');
var routeConfig = require('./route-config');
var settingsConfig = require('./settings/settings-config');
var morgan = require('morgan');
application.injectionContainer = require('./injectionContainer.js')({ registry: './dependencies.json' });

function configureWorker(application) {
	configureApplication(application);
	configureRoutes(application);
	createErrorHandler(application);

	startServer(application);
}

function configureApplication(application) {
	application.use(bodyParser.json());

	application.use(function(req, res, next) {
		res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
		res.set('Pragma', 'no-cache');
		res.set('Expires', '0');
		res.type('application/json');
		next();
	});

	application.use(morgan('combined'));
}

function configureRoutes(application) {
	routeConfig.registerRoutes(application);
}

/* eslint-disable max-params, no-unused-vars */

function createErrorHandler(application) {
	application.use((error, req, res, next) => {
		return res.status(500).json('an unhandled exception occurred');
	});
}

/* eslint-enable max-params, no-unused-vars */

function startServer(application) {
	var server = http.createServer(application);

	server.listen(settingsConfig.settings.workerPort, settingsConfig.settings.hostName, settingsConfig.settings.queueLength, function() {
		console.log('listening at http://%s:%s', settingsConfig.settings.hostName, settingsConfig.settings.workerPort);
	});
}

configureWorker(application);
