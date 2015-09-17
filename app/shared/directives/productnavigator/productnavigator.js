(function(_){
	'use strict';
	
	function communityProductNavigator() {
		var link = function(scope, element, attrs) {
		};

		var controller = function(timelineService) {
			var ctrl = this;

			_.extend(ctrl, {

			});
		};
		controller.$inject = ['CommunityTimelineService'];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/productnavigator/productnavigator.html',
	        controllerAs: 'timeline',
	        bindToController: true,
	        restrict: 'E',
	        scope: {
	        }
	    };
	    return directive;
	}

	angular.module('community.directives')
		.directive('communityProductNavigator', communityProductNavigator);
		
}(window._));