
function <%= repositoryClassName.toLowerCase() %>Repository(deps) {
	const instance = {};

	instance.create = function(<%= repositoryClassName.toLowerCase() %>) {
		return Promise.resolve(<%= repositoryClassName.toLowerCase() %>);
	};
	
	instance.retrieve = function(id) {
		return Promise.resolve({ id: id });
	};
	
	instance.update = function(<%= repositoryClassName.toLowerCase() %>) {
		return Promise.resolve(<%= repositoryClassName.toLowerCase() %>);
	};
	
	instance.delete = function(id) {
		return Promise.resolve(true);
	};

	return instance;
}

module.exports = function(deps) {
	_checkDeps(deps);
	return <%= repositoryClassName.toLowerCase() %>Repository(deps);
};

function _checkDeps(deps) {
	// test dependencies for required functionality
	// throw errors when tests fail
}
