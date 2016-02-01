
'use strict';

var _ = require('underscore');


var permissions = function($parse, $q, routingService){

	// ##########
	// # MESSAGES
	// ##########
	// can_comment
	// can_edit_message
	// can_kudo
	// can_thank
	// can_view_message
	// can_vote

	// #######
	// # NODES
	// #######
	// can_post_topic
	// can_view_node

	var currentPermissions = null;
	var permissionKeys = {
		message: [ 'can_comment',  'can_edit_message', 'can_kudo', 'can_thank', 'can_view_message', 'can_vote' ],
		node: ['can_post_topic', 'can_view_threads']
	};

	var permissionStrings = {
		message: permissionKeys.message.join(','),
		node: permissionKeys.node.join(',')
	}

	var currentPermissions = {
		message: null,
		node: null
	}

	return {
		hasPermission: function(requestedPermissions, currentUser, entityId) {
			var isAuthenticated = currentUser.isAuthenticated();
			if (!isAuthenticated) {
				return false;
			}

			var hasPermissionsRequested = true;
			 _.each(requestedPermissions, function(requestedPermission) {
			 	if (hasPermissionsRequested) {
			 		var permissionParts = requestedPermission.split('.');
			 		var permissionType = permissionParts[0];
			 		var permissionName = permissionParts[1];
			 		
			 		if (permissionType === 'message' && !entityId) {
			 			entityId = Number(routingService.getCurrentId());
			 		}

			 		var permissionList = currentPermissions[permissionType];

			 		if (permissionList) {
			 			hasPermissionsRequested = permissionList.hasOwnProperty(permissionName) && (entityId ? permissionList[permissionName][entityId] === null : permissionList[permissionName] === null);
			 		}
			 	}
			 });
			 return !!hasPermissionsRequested;
		},
		canEdit: function(messasgeId){
			var permService = this;
			return currentUserService.get().then(function(userObj){
				var currentUser = userObj.user;
				return permService.hasPermission(['message.can_edit_message'], currentUser, messasgeId);
			});
		},
		setUserPermissions: function(permissions){
			currentPermissions = permissions;
		},
		addPermissionKeys: function(paramObject, type){
			if (!paramObject) {
				paramObject = {};	
			}
			paramObject.entityPolicies = permissionStrings[type];
			return paramObject;
		},
		loadNodePermissions: function(permissions){
			currentPermissions.node = permissions;
		},
		loadMessagePermissions: function(permissions) {
			currentPermissions.message = permissions;
		}
	};
};
permissions.$inject = ['$parse', '$q', require('services/routing.js')];

var serviceName = 'CommunityPermissionsService';
angular.module('community.services')
	.service(serviceName, permissions);

module.exports = serviceName;

