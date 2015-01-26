define([
	'jquery',
	'vendor/klass'
], function ($, klass) {
	'use strict';

	/**
	 * Base class
	 */
	return klass({

		options: {},

		initialize: function(options) {
			var self = this;

			self.setOptions(options);
		},

		setOptions: function(options){
			$.extend(true, this.options || {}, options || {});
		},

		option: function(name){
			return this.options[name];
		}

	});

});
