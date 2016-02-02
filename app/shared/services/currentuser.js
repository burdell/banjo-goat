'use strict';

var currentUser = function(apiService, $q){
	var currentUser = {
		user: null,
		isAuthenticated: function(){
			return !!currentUser.user && currentUser.user.id >= 0; 
		}
	};

		return {
			get: function(attr){
				if (!currentUser.user) {
					return apiService.Users.authentication().then(function(result){
						currentUser.user = result;
						return currentUser;
					});
				} 
				return $q.when(currentUser);
			}
		};
	};
	currentUser.$inject = [require('services/api.js'), '$q'];

var serviceName = 'CurrentUserService';
require('angular').module('community.services')
	.service(serviceName, currentUser);

module.exports = serviceName;
