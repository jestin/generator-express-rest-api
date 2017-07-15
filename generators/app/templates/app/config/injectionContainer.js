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

	function getConcrete(iface) {
		if (!registry.dependencies[iface]) {
			throw new Error(`could not find iface ${iface} in dependency registry`);

		}
		// first check the singletons list to avoid
		// creating a second instance
		if (singletons[iface]) {
			return singletons[iface];
		}

		// resolve all dependencies of the dependency
		var deps = {};
		if (registry.dependencies[iface].dependencies) {
			_.each(registry.dependencies[iface].dependencies, dep => {
				try {
					deps[dep] = getConcrete(dep);
				} catch (err) {
					throw new Error(`could not find dependency ${dep} of dependency ${iface}`, err);
				}
			});
		}

		// create instance
		var instance = require(registry.dependencies[iface].concrete)(deps);

		// save in singletons list if singleton is specified
		if (registry.dependencies[iface].singleton) {
			singletons[iface] = instance;
		}

		return instance;
	}

	return { getConcrete };
};
