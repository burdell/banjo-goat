(function(_){
	'use strict';
	
	function communitySearch() {
		var link = function(scope, element, attrs) {
		};

		var controller = function() {
			var searchDelay = this.searchDelay || 300;

			var ctrl = this;
			_.extend(ctrl, {
				modelOptions: {
					debounce: searchDelay
				},
				searchQuery: ctrl.searchFilter.model('q'),
				search: function(){
					ctrl.searchFilter.filter({ q: ctrl.searchQuery }, ctrl.exclude);
				}
			});
		};
		controller.$inject = [];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/searchbox/searchbox.html',
	        controllerAs: 'searchbox',
	        bindToController: true,
	        restrict: 'E',
	        scope: {
	        	exclude: '@',
	        	searchFilter: '=',
	        	placeholder: '@',
	        	searchDelay: '@'
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communitySearch', communitySearch);
		
}(window._));