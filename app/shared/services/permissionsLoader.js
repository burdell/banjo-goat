
'use strict';

var _ = require('underscore');

var permissionsLoader = function($q, errorService, permissionsService){
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
		},
		responseError: function(result) {
			errorService.showErrors(result.data);
			return $q.reject();
		}
	}
};
permissionsLoader.$inject = ['$q', require('services/error.js'), require('services/permissions.js')];

var serviceName = 'CommunityPermissionsInterceptor';
angular.module('community.services')
	.factory(serviceName, permissionsLoader);

