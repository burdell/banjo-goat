(function(_){
	'use strict';
	
	function communityUserBadge() {
		var link = function(scope, element, attrs) {			
		};

		var controller = function($scope, userService) {
			var ctrl = this;

			if (this.currentUser) {
				userService.get().then(function(user){
					ctrl.displayUser = user;
				});
			} else {
				ctrl.displayUser = ctrl.user
			}

			var ubntEmployee = {
				userMatched: function(){
					return ctrl.displayUser && ctrl.displayUser.login.indexOf("UBNT-") >= 0;
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
		controller.$inject = ['$scope', 'CurrentUserService'];

	    var directive = {
	        link: link,
	        controller: controller,
	        controllerAs: 'userbadge',
	        bindToController: true,
	        replace: true,
	        templateUrl: 'directives/userbadge/userbadge.html',
	        restrict: 'E',
	        scope: {
	        	user: '=',
	        	opId: '=',
	        	currentUser: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityUserBadge', communityUserBadge);
		
}(window._));