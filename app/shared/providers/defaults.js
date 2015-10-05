(function(_) {
	'use strict';

	var defaultsProvider = function(){
		var defaults = {
			noPhoto: 'http://i.imgur.com/TT7XC8m.jpg'
		};

		this.defaults = defaults;
		this.$get = function(){
			return this.defaults;
		}
	};

	angular.module('community.providers')
		.provider('communityDefaults', defaultsProvider);

}(window._));