(function(_) {
	'use strict';
	
	var permissions = function(){
		return {
			hasPermission: function(requestedPermissions, currentUser) {
				return currentUser.isAuthenticated();
			}
		};
	};
	permissions.$inject = [];

	angular.module('community.services')
		.service('CommunityPermissionsService', permissions);

}(window._));