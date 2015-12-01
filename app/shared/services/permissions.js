
'use strict';

var permissions = function(currentUserService){
	return {
		hasPermission: function(requestedPermissions, currentUser) {
			return currentUser.isAuthenticated();
		},
		canEdit: function(checkedUserId){
			return currentUserService.get().then(function(userObj){
				var currentUser = userObj.user;
				return userObj.isAuthenticated() && currentUser.id === checkedUserId;
			});
		}
	};
};
permissions.$inject = [require('services/currentuser.js')];

var serviceName = 'CommunityPermissionsService';
angular.module('community.services')
	.service(serviceName, permissions);
module.exports = serviceName;

