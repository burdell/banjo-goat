
	'use strict';

	require('services/data.js');

	require('filters/extractkey.js');
	require('filters/timefromnow.js');
	require('filters/unformattext.js');
	require('filters/wordcut.js');

	require('directives/texteditor/texteditor.js');
	require('directives/pager/pager.js');
	
	var _ = require('underscore');

	function featuresListController ($stateParams, dataService, featuresData, featuresListFilter){
		var ctrl = this;

		function setMessageData (result){			
			ctrl.featuresCount = result.totalElements;
			ctrl.numberOfPages = result.totalPages;
			ctrl.featuresList = result.content;
		}
		featuresListFilter.set({ onFilter: setMessageData });

		function makeFilterList(dataList, defaultValString) {
			var newList = []; //{ display: defaultValString, value: null, selected: true }
			_.each(dataList, function(dataType, id) {
				newList.push({ value: dataType.code, display: dataType.display, selected: false });
			});
			return newList;
		}

		function filterRequests() {
				var filterModel = {
					request: null,
					status: null,
					severity: null,
					attachment: null
				};
				
				_.each(ctrl.filterTypes, function(filterType){
					var selected = _.filter(filterType.filterList, function(filterItem){
						return filterItem.selected;
					});

					if (selected.length > 0) {
						filterModel[filterType.param] = _.pluck(selected, 'value');
					}
				});

				featuresListFilter.filter(filterModel, 'limit, offset');
		}

		var statusTypes = featuresData.StatusTypes;
		var filterLists = null;

		_.extend(ctrl, {
			messageSortOptions: dataService.MessageSort,
			featuresListFilter: featuresListFilter,
			getStatusCode: function(feature){
				return statusTypes[feature.state].code;
			},
			getStatusText: function(feature){
				return statusTypes[feature.state].display;
			},
			filterTypes: [
				{
					param: 'request',
					defaultOption: { display: 'All Request Types', value: null, selected: true }, 
					filterList: [
						{ display: 'Alpha', value: 'alpha', selected: false },
						{ display: 'Beta', value: 'beta', selected: false },
						{ display: 'General', value: 'general', selected: false }
					],
				},
				{ 
					param: 'status', 
					filterList: makeFilterList(featuresData.StatusTypes),
					defaultOption: { display: 'All Status Types', value: null, selected: true }, 

				},
				{ 
					param: 'severity', 
					filterList: makeFilterList(featuresData.SeverityLevels), 
					defaultOption: { display: 'All Severity Levels', value: null, selected: true }, 
				},
				{
					param: 'attachment',
					filterList: [
						{ display: 'Photo', value: 'photo' },
						{ display: 'Video', value: 'video' }
					],
					defaultOption: { display: 'All Attachments', value: null, selected: true } 
				}
			],
			showNewPost: false,
			newFeature: {
				subject: null,
				body: null
			},
			cancelSubmit: function(){
				ctrl.showNewPost = false;
			},
			submitFeature: function(){
				console.log(ctrl.newFeature);
			},
			filterChanged: function(filterType) {
				var filterList = filterType.filterList;
				var filtersSelected = _.some(_.pluck(filterList, 'selected'));

				//if there are no filters selected, the default option should be selected
				filterType.defaultOption.selected = !filtersSelected;

				filterRequests();
			},
			defaultChanged: function(filterType){
				if (filterType.defaultOption.selected) {
					_.each(filterType.filterList, function(filter) {
						filter.selected = false;
					});
				} else {
					//this should never happen unless a user manually un-disables the element
					filterType.defaultOption.selected = true;
				}

				filterRequests();
			}
		});

	
		//set filters from params
		_.each(ctrl.filterTypes, function(filterType) {
			var filterParam = $stateParams[filterType.param];
			if (filterParam) {
				if (!_.isArray(filterParam)) {
					filterParam = [ filterParam ];
				}

				_.each(filterParam, function(paramString){
					var matchedFilter = _.where(filterType.filterList, { value: paramString });
					if (matchedFilter.length > 0) {
						matchedFilter[0].selected = true;
						filterType.defaultOption.selected = false;
					}
				});
			}
		});
	}
	featuresListController.$inject = ['$stateParams', 'CommunityDataService', 'FeaturesDataService', 'FeaturesListFilter'];

	angular.module('community.features')
		.controller('FeaturesList', featuresListController);


