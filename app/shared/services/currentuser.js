(function(_) {
	'use strict';

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
						currentUser.user = result.auth.model;
						return currentUser;
					});
				} 

				return $q.when(currentUser);
			}
		};
	};
	currentUser.$inject = ['$q', 'CommunityApiService', 'CommunityInitializeService'];

	angular.module('community.services')
		.service('CurrentUserService', currentUser);

}(window._));