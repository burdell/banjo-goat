
'use strict';

var moment = require('moment');

function localizationService(localizedData) {
	if (localizedData.momentConfig) {
		moment.locale(localizedData.locale, localizedData.momentConfig);
	}

	var service = function(){		
		return {
			data: localizedData,
			currentLocale: localizedData.locale,
			getAreas: function(){
				return localizedData.core.areas;
			}
		}
	};
	localizationService.$inject = [];

	var localizationProvider = function(){	
		this.localizedData = localizedData;
		this.$get = function(){
			return this.localizedData;
		}
	};


	var serviceName = 'CommunityLocalizationService';
	angular.module('community.services')
		.provider('CommunityLocalizationProvider', localizationProvider)
		.service(serviceName, service);	
}

module.exports = localizationService;
