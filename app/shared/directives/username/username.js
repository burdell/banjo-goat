'use strict';

require('services/currentuser.js');
require('services/routing.js');

require('directives/arealinkhandler/arealinkhandler.js');

var _ = require('underscore');

function communityUsername() {
	var link = function(scope, element, attrs) {			
	};

	var controller = function(userService, routingService) {
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
				setProfileHref();
			});
		} else {
			displayUser = ctrl.user;
			setSpecialUser();
			setProfileHref();
		}

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

		function setProfileHref() {
			if (!displayUser) {
				return;
			}
			ctrl.userProfileHref = routingService.generateUrl('userprofile', { userId: displayUser.login });
		}

	};
	controller.$inject = ['CurrentUserService', 'CommunityRoutingService'];

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
	

