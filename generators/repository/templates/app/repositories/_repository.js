
function <%= repositoryClassName %>Repository(deps) {
}

function get<%= repositoryClassName %>Data(id) {
	return { id: id };
}

	<%= repositoryClassName %>Repository.prototype = {
		get<%= repositoryClassName %>Data: get<%= repositoryClassName %>Data
	};

module.exports = function(deps) {
	return new <%= repositoryClassName %>Repository(deps);
};
