
function <%= repositoryClassName %>Repository(deps) {
}

function create(<%= repositoryClassName.toLowerCase() %>) {
	return Promise.resolve();
}

/* eslint-disable object-curly-newline, object-shorthand */
function retrieve(id) {
	return Promise.resolve({ id: id });
}

function update(<%= repositoryClassName.toLowerCase() %>) {
	return <%= repositoryClassName.toLowerCase() %>;
}

function delete(<%= repositoryClassName.toLowerCase() %>) {
	return Promise.resolve(true);
}

/* eslint-enable object-curly-newline, object-shorthand */

<%= repositoryClassName %>Repository.prototype = {
	create,
	retrieve,
	update,
	delete
};

module.exports = function(deps) {
	_checkDeps(deps);
	return new <%= repositoryClassName %>Repository(deps);
};

function _checkDeps(deps) {
	// test dependencies for required functionality
	// throw errors when tests fail
}
