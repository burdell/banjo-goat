(function(_){
	'use strict';

	function featuresListController (featuresData, featuresListFilter){
		var ctrl = this;

		function setMessageData (result){
			ctrl.featuresList = result.collection;
			ctrl.featuresCount = result.next.total;
		}
		featuresListFilter.set({ onFilter: setMessageData });

		function makeFilterList(dataList, defaultValString) {
			var newList = [{ display: defaultValString, value: null, isDefault: true }];
			_.each(dataList, function(dataType, id) {
				newList.push({ value: id, display: dataType.display });
			});
			return newList;
		}

		var statusTypes = featuresData.StatusTypes;
		_.extend(ctrl, {
			featuresListFilter: featuresListFilter,
			getStatusText: function(statusType){
				return statusTypes[statusType].display;
			},
			filterTypes: [
				{
					param: 'requestType',
					filterList: [
						{ display: 'All Request Types', value: null, isDefault: true },
						{ display: 'Alpha', value: 'alpha' },
						{ display: 'Beta', value: 'beta' },
						{ display: 'General', value: 'general' }
					],
				},
				{ param: 'statusType', filterList: makeFilterList(featuresData.StatusTypes, 'All Status Types') },
				{ param: 'severity', filterList: makeFilterList(featuresData.SeverityLevels, 'All Severity Levels') },
				{
					param: 'attachmentType',
					filterList: [
						{ display: 'All Attachments', value: null, isDefault: true },
						{ display: 'Photo', value: 'photo' },
						{ display: 'Video', value: 'video' }
					],
				},

			],
			filterModel: {
				requestType: null,
				statusType: null,
				severity: null,
				attachmentType: null
			}
		});
	}
	featuresListController.$inject = ['FeaturesDataService', 'FeaturesListFilter'];

	angular.module('community.features')
		.controller('FeaturesList', featuresListController);

}(window._));
