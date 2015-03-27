(function(_){
	'use strict';
	
	function communitySearch() {
		var link = function(scope, element, attrs) {
		};

		var controller = function() {
			var searchDelay = this.searchDelay || 300;
			this.modelOptions = {
				debounce: searchDelay
			};
		};
		controller.$inject = [];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/searchbox/searchbox.html',
	        controllerAs: 'searchbox',
	        bindToController: true,
	        restrict: 'AE',
	        scope: {
	        	exclude: '@',
	        	filterFn: '=',
	        	placeholder: '@',
	        	searchDelay: '@',
	        	searchList: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.shared')
		.directive('communitySearch', communitySearch);
		
}(window._));