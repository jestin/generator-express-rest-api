
function <%= controllerClassName.toLowerCase() %>Controller(deps) {
	const instance = {};

	// set dependencies

	instance.<%= controllerMethod.toLowerCase() %> = function(req, res, next) {
		return res.status(200).json({ hello: 'world' }); // eslint-disable-line no-magic-numbers
	};
	return instance;
}

module.exports = function(deps) {
	_checkDeps(deps);
	return <%= controllerClassName.toLowerCase() %>Controller(deps);
};

function _checkDeps(deps) {
	// test dependencies for required functionality
	// throw errors when tests fail
}
