var Promise = require('bluebird'),
	routes = {};

module.exports = {
	/**
	 * Add Promise
	 * @param route
	 * @param callback
	 */
	addFor: function(route, name, callback){
        var reg = pathtoRegexp(route);

		if(!routes[route]){
			routes[route] = reg;
            routes[route].callbacks = [];
        }

		routes[route].callbacks.push({
            'name': name,
            'handle': callback
        });
	},

	/**
	 * Request Promise
	 * @returns {callback}
	 */
	get: function(route){

        var props = {},
            parsed = this.parseRoute(route);

        if(parsed != null){
            _.each(routes[parsed.route].callbacks, function(callback){
                props[callback.name] = callback.handle.call(callback.handle, parsed.params);
            });
        }

		return Promise.props(props);
	},

    /**
     * Match route on regex
     * @param route
     * @returns {object}, null
     */
	parseRoute: function(route){

        var has_match = false,
            params = {};

        _.each(routes, function(r, path){
            if(has_match) return;

            var match = route.match(r.regex);
            if(match){
                has_match = path;
                _.each(r.keys, function(key, nr){
                    params[key.name] = match[nr+1];
                });
            }
        });

		return has_match ? {
            'route': has_match,
            'params': params
        } : null;
	}
};


function pathtoRegexp(path){
    var keys = [];

    path = ('^' + path + (path[path.length - 1] === '/' ? '?' : '/?'))
        .replace(/\/\(/g, '/(?:')
        .replace(/([\/\.])/g, '\\$1')
        .replace(/(\\\/)?(\\\.)?:(\w+)(\(.*?\))?(\*)?(\?)?/g, function(match, slash, format, key, capture, star, optional){
            slash = slash || '';
            format = format || '';
            capture = capture || '([^\\/' + format + ']+?)';
            optional = optional || '';

            keys.push({name: key, optional: !!optional});

            return ''
                + (optional ? '' : slash)
                + '(?:'
                + format + (optional ? slash : '') + capture
                + (star ? '((?:[\\/' + format + '].+?)?)' : '')
                + ')'
                + optional;
        })
        .replace(/\*/g, '(.*)');

    path += '$';

    return {
        'regex': new RegExp(path, ''),
        'keys': keys
    };
};
