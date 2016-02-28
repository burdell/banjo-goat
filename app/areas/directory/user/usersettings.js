
'use strict';

require('directives/map/locationsearch.js');

var _ = require('underscore');

var userSettingsController = function(userData, userSettings, breadcrumbService){
	var ctrl = this;

	// debugger;

	var currentBreadcrumb = breadcrumbService.CurrentBreadcrumb;
	var userName = userData.user.login;
	if (!currentBreadcrumb || currentBreadcrumb.name !== userName) {
		breadcrumbService.setCurrentBreadcrumb(userName);
	}

	_.extend(ctrl, {
		userData: userData.user,
		settingsModel: {},
		coordinates: {
			locLat: userData.locLat || null,
			locLon: userData.locLon || null,
			locName: userData.locName || ''
		},
		saveSettings: function(){
			console.log(ctrl.settingsModel);
		}
	});
};
userSettingsController.$inject = ['UserData', 'UserSettings', require('services/breadcrumb.js')];

angular.module('community.directory')
	.controller('UserSettings', userSettingsController);

