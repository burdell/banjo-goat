(function(_){
	'use strict';
	
	function communityUserAvatar() {
		var link = function(scope, element, attrs) {			
		};

		var controller = function() {
		};
		controller.$inject = [];

	    var directive = {
	        link: link,
	        controller: controller,
	        controllerAs: 'useravatar',
	        bindToController: true,
	        replace: true,
	        templateUrl: 'directives/useravatar/useravatar.html',
	        restrict: 'E',
	        scope: {
	        	user: '=',
	        	inline: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityUserAvatar', communityUserAvatar);
		
}(window._));