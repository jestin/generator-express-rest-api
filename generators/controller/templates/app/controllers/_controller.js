
function <%= controllerClassName %>Controller(deps) {
	// set dependencies
}

function <%= controllerMethod.toLowerCase() %>(req, res, next) {
	res.status(200).json({ hello: 'world' }); // eslint-disable-line no-magic-numbers
}

/* eslint-disable object-curly-newline, object-shorthand */
<%= controllerClassName %>Controller.prototype = {
	<%= controllerMethod.toLowerCase() %>: <%= controllerMethod.toLowerCase() %>
};
/* eslint-enable object-curly-newline, object-shorthand */

module.exports = function(deps) {
	_checkDeps(deps);
	return new <%= controllerClassName %>Controller(deps);
};

function _checkDeps(deps) {
	// test dependencies for required functionality
	// throw errors when tests fail
}
