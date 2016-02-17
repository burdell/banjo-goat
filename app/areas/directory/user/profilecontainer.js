
'use strict';

var _ = require('underscore');


var profileController = function(userData){
	var ctrl = this;

	_.extend(ctrl, {
		userData: userData.user,
		hideElementFn: function(fromState, toState) {
			return '.profile-container';
		}
	});
};
profileController.$inject = ['UserData'];

angular.module('community.directory')
	.controller('UserProfileContainer', profileController);

