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
		const middleware = getMiddleware(routeItem);

		registerRoute(application)(route)(method)(middleware)(controller)(action);
	});

	createConfigRoute(application);
	createErrorHandler(application);
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

function getMiddleware(routeItem) {
	if (!routeItem || !routeItem.middleware || routeItem.middleware.length === 0) {
		return [];
	}

	return routeItem.middleware;
}

function registerRoute(application) {
	return route => {
		return method => {
			return middleware => {
				const middlewareConcretes = _.map(middleware, mw => {
					return application.injectionContainer.getConcrete(mw);
				});

				return controller => {
					return action => {
						application.route(route)[method](...middlewareConcretes, function(req, res, next) {
							controller[action](req, res, next);
						});
					};
				};
			};
		};
	};
}

function createConfigRoute(application) {
	application.route('/config').get(function(req, res) {
		res.status(200).json(settingsConfig.settings);
	});
}

/* eslint-disable max-params, no-unused-vars */

function createErrorHandler(application) {
	application.use((error, req, res, next) => {
		return res.status(500).json('an unhandled exception occurred');
	});
}

/* eslint-enable max-params, no-unused-vars */

RouteConfig.prototype = { registerRoutes };

var routeConfig = new RouteConfig();

module.exports = routeConfig;
