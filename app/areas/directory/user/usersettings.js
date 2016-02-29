
'use strict';

require('directives/map/locationsearch.js');

var _ = require('underscore');

var userSettingsController = function($state, $stateParams, userData, userSettings, breadcrumbService, communityApi){
	var ctrl = this;

	// debugger;

	var currentBreadcrumb = breadcrumbService.CurrentBreadcrumb;
	var userName = userData.user.login;
	if (!currentBreadcrumb || currentBreadcrumb.name !== userName) {
		breadcrumbService.setCurrentBreadcrumb(userName);
	}


	_.extend(ctrl, {
		userData: userData.user,
		userSettings: userSettings.content,
		signature: "",
		accountModel: {weeklyDigest: false, emailAlerts: false},
		profileModel: {name: "", about: "", company: "", website: "", linkedin: "", twitter: ""},
		subscriptionModel: {auto: true},
		coordinates: {
			locLat: userData.locLat || null,
			locLon: userData.locLon || null,
			locName: userData.locName || ''
		},
		// first section: account
		saveAccount: function() {
			var data = [];
			for (var item in ctrl.accountModel) {
				var datum = {id: getId(item), key: item, value: ctrl.accountModel[item]};
				data.push(datum);
			}

			communityApi.Users.saveSettings(data).then(
				function(result){
					refresh();
				}
			);
		},
		// second section: profile
		saveProfile: function() {
			var data = [];
			for (var item in ctrl.profileModel) {
				var datum = {id: getId(item), key: item, value: ctrl.profileModel[item]};
				data.push(datum);
			}

			communityApi.Users.saveSettings(data).then(
				function(result){
					refresh();
				}
			);
		},
		saveSignature: function(){
			// signature stored in meta as part of profile
			console.log('saving sig: ');

			var data = null;
			data = _.extend(ctrl.userData,ctrl.signature);
			// data = {meta: {signature: ctrl.signature}}
			console.log(data);

			communityApi.Users.updateUser(data).then(
				function(result){
					$state.go('userprofile.usersettings');		
				}
			);
		},
		// fourth section: auto subscribe (this will have to appear on the subscription page as well)
		saveSubscription: function() {
			var data = [];
			for (var item in ctrl.subscriptionModel) {
				console.log('saving; ' + item)
				var datum = {id: getId(item), key: item, value: ctrl.subscriptionModel[item]};
				data.push(datum);
			}

			communityApi.Users.saveSettings(data).then(
				function(result){
					refresh();
				}
			);
		},
	});


	// get the value of the setting frmo a key value
	var getValue = function(key) {
		for (var i in ctrl.userSettings ) {
			if ( key == ctrl.userSettings[i].key ) {
				if (ctrl.userSettings[i].value === "true") return true;
				if (ctrl.userSettings[i].value === "false") return false;
				return ctrl.userSettings[i].value;
			}
		}
		return "";
	}

	var bindModel = function(model) {
		for (var i in model ) {
			model[i] = getValue(i);
		}
	}

	var refresh = function() {
		$state.transitionTo($state.current, $stateParams, {
		    reload: true,
		    inherit: false,
		    notify: true
		});	
	}


	// because model from db is a little different, we need to map db to ng models
	bindModel(ctrl.accountModel);
	bindModel(ctrl.profileModel);
	bindModel(ctrl.subscriptionModel);

	// ctrl.accountModel.emailAlerts = true;


	// get the id value of the setting from a key value
	var getId = function(key) {
		for (var i in ctrl.userSettings ) {
			if ( key == ctrl.userSettings[i].key ) return ctrl.userSettings[i].id;
		}
		return 0; // when there's no match, using key = 0 will create a new setting value
	}


};
userSettingsController.$inject = [
	'$state',
	'$stateParams',
	'UserData', 
	'UserSettings', 
	require('services/breadcrumb.js'),
	require('services/api.js')
];

angular.module('community.directory')
	.controller('UserSettings', userSettingsController);

