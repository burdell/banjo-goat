(function(_) {
	'use strict';

	var currentUser = function(){
		var user = null;

		return {
			set: function(userObject){
				user = userObject;
			},
			get: function(attr){
				if (_.isUndefined(attr)) {
					return user;
				}

				return user[attr];
			}
		}
	};

	angular.module('community.services')
		.service('CurrentUserService', currentUser);

}(window._));