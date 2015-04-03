(function(_){
	'use strict';
	
	function communitySort() {
		var link = function(scope, element, attrs) {
		};

		var controller = function() {
		};
		controller.$inject = [];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/sorter/sorter.html',
	        controllerAs: 'sorter',
	        bindToController: true,
	        restrict: 'E',
	        scope: {
	        	'sortOptions': '=',
	        	'ngModel': '='
	        }
	    };

	    return directive;
	}

	angular.module('community.shared')
		.directive('communitySort', communitySort);
		
}(window._));