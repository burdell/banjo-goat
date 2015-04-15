(function(_){
	'use strict';
	
	function communityUserBadge() {
		var link = function(scope, element, attrs) {			
		};

		var controller = function() {
		};
		controller.$inject = [];

	    var directive = {
	        link: link,
	        controller: controller,
	        controllerAs: 'userbadge',
	        bindToController: true,
	        replace: true,
	        templateUrl: 'directives/userbadge/userbadge.html',
	        restrict: 'E',
	        scope: {
	        	user: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityUserBadge', communityUserBadge);
		
}(window._));