(function(_){
	'use strict';
	
	function communitySort() {
		var link = function(scope, element, attrs) {
		};

		var controller = function() {
			var ctrl = this;

			ctrl.sortValue = null;
			ctrl.sort = function(){
				ctrl.sortFilter.filter({ sort: ctrl.sortValue }, ctrl.sortExclude);
			};
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
	        	'sortFilter': '=',
	        	'sortExclude': '@'
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communitySort', communitySort);
		
}(window._));