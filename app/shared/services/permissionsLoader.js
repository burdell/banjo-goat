
'use strict';

var _ = require('underscore');

var permissionsLoader = function(permissionsService){
	return {
		response: function(result){
			if (_.isObject(result.data)){
				if (result.data.hasOwnProperty('policies')) {
					permissionsService.loadNodePermissions(result.data.policies);
				}

				if (result.data.hasOwnProperty('entityPolicies')) {
					permissionsService.loadMessagePermissions(result.data.entityPolicies);
				}
			}
 			return result;
		}
	}
};
permissionsLoader.$inject = [require('services/permissions.js')];

var serviceName = 'CommunityPermissionsInterceptor';
angular.module('community.services')
	.factory(serviceName, permissionsLoader);

