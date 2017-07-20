const settingsConfig = require('./settings/settings-config');
const _ = require('underscore');

function RouteConfig() {
}

function registerRoutes(application) {
	var config = loadRouteConfig();

	_.each(config.routes, routeItem => {
		const controller = loadController(routeItem, application);
		const route = getRoute(routeItem);
		const method = getMethod(routeItem);
		const action = getAction(routeItem);

		registerRoute(application)(controller)(route)(method, action);
	});

	createConfigRoute(application);
}

function loadRouteConfig() {
	var config;

	try {
		config = require('./route.config.json');

		if (!config.routes || !config.routes.length) {
			throw new Error('"routes" not defined');
		}
	} catch (e) {
		throw new Error(`Unable to parse "lib/config/route.config.json": ${e}`);
	}

	return config;
}

function loadController(routeItem, application) {
	var controller;

	if (!routeItem || !routeItem.controller) {
		throw new Error('Undefined "controller" property in "lib/config/route.config.json"');
	}

	try {
		controller = application.injectionContainer.getConcrete(routeItem.controller);
	} catch (e) {
		throw new Error(`Unable to load ${e}`);
	}

	return controller;
}

function getRoute(routeItem) {
	if (!routeItem || !routeItem.route || routeItem.route.length === 0) {
		throw new Error('Undefined or empty "route" property in "lib/config/route.config.json"');
	}

	return routeItem.route;
}

function getMethod(routeItem) {
	if (!routeItem || !routeItem.method || routeItem.method.length === 0) {
		throw new Error('Undefined or empty "method" property in "lib/config/route.config.json"');
	}

	var method = routeItem.method.toLowerCase();

	switch (method) {
		case 'get':
		case 'put':
		case 'post':
		case 'delete':
			return method;
		default:
			throw new Error(`Invalid REST "method" property in "lib/config/route.config.json": ${method}`);
	}
}

function getAction(routeItem) {
	if (!routeItem || !routeItem.action || routeItem.action.length === 0) {
		return getMethod(routeItem);
	}
	return routeItem.action;
}


function registerRoute(application) {
	return controller => {
		return route => {
			return (method, action) => {
				application.route(route)[method](function(req, res, next) {
					controller[action](req, res, next);
				});
			};
		};
	};
}

function createConfigRoute(application) {
	application.route('/config').get(function(req, res) {
		res.status(200).json(settingsConfig.settings);
	});
}

RouteConfig.prototype = { registerRoutes };

var routeConfig = new RouteConfig();

module.exports = routeConfig;
