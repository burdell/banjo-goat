
	'use strict';

	require('services/data.js');

	require('filters/extractkey.js');
	require('filters/timefromnow.js');
	require('filters/unformattext.js');
	require('filters/wordcut.js');

	require('directives/texteditor/texteditor.js');
	require('directives/pager/pager.js');
	
	var _ = require('underscore');

	function featuresListController ($stateParams, $state, dataService, featuresData, featuresListFilter){
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
				return statusTypes[feature.topic.state].code;
			},
			getStatusText: function(feature){
				return statusTypes[feature.topic.state].display;
			},
			filterTypes: [
				{ 
					param: 'status', 
					filterList: makeFilterList(featuresData.StatusTypes),
					defaultOption: { display: 'All Status Types', value: null, selected: true }, 

				}
			],
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
			},
			isUnread: function(featureData){
				return !featureData.context.lastReadDate;
			},
			newFeature: function(){
				$state.go('features.newtopic');
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
	featuresListController.$inject = ['$stateParams', '$state', 'CommunityDataService', 'FeaturesDataService', 'FeaturesListFilter'];

	angular.module('community.features')
		.controller('FeaturesList', featuresListController);


