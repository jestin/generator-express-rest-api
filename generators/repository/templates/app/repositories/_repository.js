
function <%= repositoryClassName %>Repository(deps) {
}

function get<%= repositoryClassName %>Data(id) {
	return { id: id };
}

<%= repositoryClassName %>Repository.prototype = {
	get<%= repositoryClassName %>Data: get<%= repositoryClassName %>Data
};

module.exports = function(deps) {
	_checkDeps(deps);
	return new <%= repositoryClassName %>Repository(deps);
};

function _checkDeps(deps) {
	// test dependencies for required functionality
	// throw errors when tests fail
}
