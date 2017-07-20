
function <%= repositoryClassName %>Repository(deps) {
}

<%= repositoryClassName %>Repository.prototype.create = function(<%= repositoryClassName.toLowerCase() %>) {
	return Promise.resolve(<%= repositoryClassName.toLowerCase() %>);
};

<%= repositoryClassName %>Repository.prototype.retrieve = function(id) {
	return Promise.resolve({ id: id });
};

<%= repositoryClassName %>Repository.prototype.update = function(<%= repositoryClassName.toLowerCase() %>) {
	return Promise.resolve(<%= repositoryClassName.toLowerCase() %>);
};

<%= repositoryClassName %>Repository.prototype.delete = function(id) {
	return Promise.resolve(true);
};

module.exports = function(deps) {
	_checkDeps(deps);
	return new <%= repositoryClassName %>Repository(deps);
};

function _checkDeps(deps) {
	// test dependencies for required functionality
	// throw errors when tests fail
}
