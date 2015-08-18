(function(_){
	'use strict';

	function featuresListController (featuresData, featuresListFilter){
		var ctrl = this;


		function setMessageData (result){
			ctrl.featuresList = result.collection;
			ctrl.featuresCount = result.next.total;
		}
		featuresListFilter.set({ onFilter: setMessageData });

		var statusTypes = featuresData.StatusTypes;
		_.extend(ctrl, {
			featuresListFilter: featuresListFilter,
			getStatusText: function(statusType){
				return statusTypes[statusType].display;
			}
		});
	}
	featuresListController.$inject = ['FeaturesDataService', 'FeaturesListFilter'];

	angular.module('community.features')
		.controller('FeaturesList', featuresListController);

}(window._));
