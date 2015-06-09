(function(_){
	'use strict';
	
	function communityUserBadge() {
		var link = function(scope, element, attrs) {			
		};

		var controller = function() {
			var user = this.user;
			var ubntEmployee = {
				userMatched: function(){
					return user.login.indexOf("UBNT-") >= 0;
				},
				userType: 'cmuUserbadge--ubnt'
			}

			var specialUsernames = [ ubntEmployee ];

			var specialUser = _.find(specialUsernames, function(usernameData) {
				return usernameData.userMatched();
			}, this) || {};
			
			var ctrl = this;			
			_.extend(ctrl, specialUser);
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