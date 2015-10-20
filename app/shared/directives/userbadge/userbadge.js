
'use strict';

require('directives/username/username.js');
require('directives/useravatar/useravatar.js');

function communityUserBadge() {
	var link = function(scope, element, attrs) {			
	};

	var controller = function($scope, userService) {
		var ctrl = this;
		var displayUser = null;
		if (this.currentUser) {
			userService.get().then(function(user){
				ctrl.displayUser = user.user;
			});
		} else {
			ctrl.displayUser = ctrl.user
		}
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
	