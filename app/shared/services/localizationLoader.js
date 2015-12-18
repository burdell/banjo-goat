
'use strict';

function loader(localizationData){
	var loaderService = function(localizationService){
		return {
			_localizationData: null,
			currentLocale: null,
			getString: function(identifier){

			}
		}
	}
	notificationService.$inject = [require('services/localization.js')];


	var serviceName = 'CommunityLocalizationService';
	angular.module('community.services')
		.service(serviceName, localizationService);
};

	
module.exports = loader;
