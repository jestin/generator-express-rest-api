module.exports = function(deps) {
	_checkDeps(deps);

	return function(req, res, next) {
		// Do stuff

		return next();
	};
};

function _checkDeps(deps) {
	// test dependencies for required functionality
	// throw errors when tests fail
}
