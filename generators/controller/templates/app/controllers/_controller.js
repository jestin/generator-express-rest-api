
function <%= controllerClassName %>Controller(deps) {
	// set dependencies
}

<%= controllerClassName %>Controller.prototype.<%= controllerMethod.toLowerCase() %> = function(req, res, next) {
	return res.status(200).json({ hello: 'world' }); // eslint-disable-line no-magic-numbers
};

module.exports = function(deps) {
	_checkDeps(deps);
	return new <%= controllerClassName %>Controller(deps);
};

function _checkDeps(deps) {
	// test dependencies for required functionality
	// throw errors when tests fail
}
