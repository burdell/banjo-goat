(function(_){
	'use strict';
	
	function communityUsername() {
		var link = function(scope, element, attrs) {			
		};

		var controller = function(userService) {
			var ctrl = this;
			var displayUser = null;

			var ubntEmployee = {
				userMatched: function(){
					var user = displayUser;
					return user && user.login && user.login.indexOf("UBNT-") >= 0;
				},
				iconClass: 'ubnt-icon--u',
				userType: 'cmuUsername--ubnt'
			}

			var specialUsernames = [ ubntEmployee ];
			var specialUser = null;

			if (ctrl.currentUser) {
				userService.get().then(function(userObj) {
					displayUser = userObj.user;
					setSpecialUser();
				});
			} else {
				displayUser = ctrl.user;
				setSpecialUser();
			}

			ctrl.fuckOff  = {
				iconClass: 'ubtn-icon--u'
			};

			var ctrl = this;			
			_.extend(ctrl, {
				displayUser: displayUser,
				specialUser: function(){
					return specialUser;
				}
			});

			function setSpecialUser() {
				 specialUser = _.find(specialUsernames, function(usernameData) {
					return usernameData.userMatched();
				}, this) || {};
			}
		};
		controller.$inject = ['CurrentUserService'];

	    var directive = {
	        link: link,
	        controller: controller,
	        controllerAs: 'username',
	        bindToController: true,
	        replace: true,
	        templateUrl: 'directives/username/username.html',
	        restrict: 'E',
	        scope: {
	        	user: '=',
	        	currentUser: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityUsername', communityUsername);
		
}(window._));
