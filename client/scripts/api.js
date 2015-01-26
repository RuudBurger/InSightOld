require([
	'js/class'
], function(
	ClassBase
) {
	'use strict';

	var API = ClassBase.extend({

		request: function(action, options){

			var token = App.getToken();
			var defaults = {
				'url': App.api_url + '/' + action + '/',
				'type': 'get',
				'dataType': 'json',
				'headers': {
					'authorization': token ? 'Bearer ' + token : null
				},
				'success': function (json) {
					p(json);
				}
			};

			$.extend(true, defaults, options);

			$.ajax(defaults);

		}

	});

	App.api = new API();

	// Shortcodes
	App.request = App.api.request;
	App.post = function(action, options){
		options.type = 'post';
		return App.request(action, options);
	};

    // Token helper
    App.getToken = function(){
        return $.localStorage.get('token') || null;
    };

	return App.api;
});
