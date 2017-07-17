
function <%= repositoryClassName %>Repository(deps) {
}

/* eslint-disable object-curly-newline, object-shorthand */
function retrieve(id) {
	return { id: id };
}
/* eslint-enable object-curly-newline, object-shorthand */

<%= repositoryClassName %>Repository.prototype = {
	retrieve: retrieve
};

module.exports = function(deps) {
	_checkDeps(deps);
	return new <%= repositoryClassName %>Repository(deps);
};

function _checkDeps(deps) {
	// test dependencies for required functionality
	// throw errors when tests fail
}
