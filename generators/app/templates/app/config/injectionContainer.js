var _ = require('underscore');

module.exports = function(deps) {
	_checkDeps(deps);

	var registry = require(deps.registry);
	var singletons = {};

	function _checkDeps(deps) {
		if (!deps.registry) {
			throw new Error('injectionContainer not passed a registry');
		}
	}

	function getConcrete(interface) {
		if (!registry.dependencies[interface]) {
			throw new Error(`could not find interface ${interface} in dependency registry`);

		}
		// first check the singletons list to avoid
		// creating a second instance
		if (singletons[interface]) {
			return singletons[interface];
		}

		// resolve all dependencies of the dependency
		var deps = {};
		if (registry.dependencies[interface].dependencies) {
			_.each(registry.dependencies[interface].dependencies, dep => {
				//try {
				var newDep = getConcrete(dep);
				deps[dep] = newDep;
				//deps[dep] = getConcrete(dep);
				//}
				//catch(err) {
				//throw new Error(`could not find dependency ${dep} of dependency ${interface}`, err);
				//}
			});
		}

		// create instance
		var instance = require(registry.dependencies[interface].concrete)(deps);

		// save in singletons list if singleton is specified
		if (registry.dependencies[interface].singleton) {
			singletons[interface] = instance;
		}

		return instance;
	}

	return {
		getConcrete: getConcrete
	}
}
