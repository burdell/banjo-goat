
'use strict';

var _ = require('underscore');

require('directives/arealinkhandler/arealinkhandler.js');
require('directives/useravatar/useravatar.js');

function communityUserBadge() {
	var link = function(scope, element, attrs) {			
	};

	var controller = function($scope, userService, routingService) {
		var ctrl = this;
		var displayUser = null;

		function setUserData(user) {
			_.extend(ctrl, {
				displayUser: user,
				profileUrl: routingService.generateUrl('userprofile', { userId: user.id })
			});
		}

		if (this.currentUser) {
			userService.get().then(function(result){
				setUserData(result.user);
			});
		} else {
			setUserData(ctrl.user);
		}
	};
	controller.$inject = ['$scope', require('services/currentuser.js'), require('services/routing.js')];

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
	