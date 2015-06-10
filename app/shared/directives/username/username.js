(function(_){
	'use strict';
	
	function communityUsername() {
		var link = function(scope, element, attrs) {			
		};

		var controller = function() {
			var user = this.user;
			var ubntEmployee = {
				userMatched: function(){
					return user && user.login.indexOf("UBNT-") >= 0;
				},
				iconClass: 'ubnt-icon--u;'
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
	        controllerAs: 'username',
	        bindToController: true,
	        replace: true,
	        templateUrl: 'directives/username/username.html',
	        restrict: 'E',
	        scope: {
	        	user: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityUsername', communityUsername);
		
}(window._));