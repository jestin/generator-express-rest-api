
function <%= controllerClassName %>Controller(deps) {
	// set dependencies
}

function <%= controllerMethod.toLowerCase() %>(req, res, next) {
	res.status(200).json({ hello: 'world' });
}

<%= controllerClassName %>Controller.prototype = {
	<%= controllerMethod.toLowerCase() %>: <%= controllerMethod.toLowerCase() %>
};

module.exports = function(deps) {
	_checkDeps(deps);
	return new <%= controllerClassName %>Controller(deps)
};

function _checkDeps(deps) {
	// test dependencies for required functionality
	// throw errors when tests fail
}
