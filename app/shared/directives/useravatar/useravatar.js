'use strict';

require('directives/arealinkhandler/arealinkhandler.js');

(function(_){
	'use strict';
	
	function communityUserAvatar() {
		var link = function(scope, element, attrs) {			
		};

		var controller = function(routingService) {
			var ctrl = this;
			var displayUser = ctrl.user;
			if (!displayUser) {
				return;
			}
			ctrl.userProfileHref = routingService.generateUrl('userprofile', { userId: displayUser.login });
		};
		controller.$inject = ['CommunityRoutingService'];

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