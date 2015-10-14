'use strict';

require('shared/services/api.js');
require('shared/services/initialize.js');

var currentUser = function($q, apiService, intializeService){
	var currentUser = {
		user: null,
		isAuthenticated: function(){
			return !!currentUser.user && currentUser.user.id >= 0; 
		}
	};

		return {
			get: function(attr){
				if (!currentUser.user) {
					return intializeService.initialize().then(function(result){
						currentUser.user = result.auth;
						
						return currentUser;
					});
				} 
				return $q.when(currentUser);
			}
		};
	};
	currentUser.$inject = ['$q', 'CommunityApiService', 'CommunityInitializeService'];

var serviceName = 'CurrentUserService';
require('angular').module('community.services')
	.service(serviceName, currentUser);

module.exports = serviceName;
