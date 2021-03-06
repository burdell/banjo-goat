
'use strict';

require('directives/feedcontent/feedcontent.js');
require('directives/pager/pager.js');
require('directives/keypress/enter.js');
require('directives/datepicker/datepicker.js');
require('directives/storydisplay/storydisplay.js');
require('directives/pagescroll/pagescroll.js');
require('directives/sticky/sticky.js');
require('directives/sorter/sorter.js');

require('filters/sanitize.js');
require('filters/unformattext.js');
require('filters/timefromnow.js');

var _ = require('underscore');

var searchPageController = function($location, $scope, breadcrumbService, localizationService, nodeServiceWrapper, searchFilter, dataService){
	var ctrl = this;

	nodeServiceWrapper.get().then(function(nodeService){
		ctrl.getUrl = function(item) {
			if (item.type == "comment") 
				return nodeService.generateNodeDetailUrl(item.data.node.id, item.data.parentId) + '#' + item.data.id;
			return nodeService.generateNodeDetailUrl(item.data.node.id, item.data.id);
		};

		var productTypes = nodeService.getProductTypeList();
		_.each(productTypes, function(productType){
			_.extend(productType, {
				defaultOption: { display: '' + productType.header, value: null, selected: true },
				list: _.map(productType.list, function(product){
					return { value: product.id, display: product.name, selected: false,  }
				}),
			});
		});

		ctrl.filterOptions.productTypes = { 
			defaultOption: { display: 'Products', value: null },
			param: 'nodeRanges',
			list: productTypes,
			getValue: function(filterModel){
				var productList = [];
				_.each(this.list, function(product){
					_.each(product.list, function(option){
						if (option.selected) {
							var selectedNode = nodeService.getNode(option.value);
							productList.push({ min: selectedNode.treeLeft, max: selectedNode.treeRight });
						}
					});
				});
				filterModel[this.param] = productList;
			}
		};
	});

	function setSearchData(result){
		ctrl.searchInProgress = false;

		var searchModel = searchFilter.model('q');
		ctrl.searchTextDisplay = searchModel;
		$location.search({ q: searchModel });

		ctrl.searchResults = result.content;
		ctrl.totalResults = result.totalElements;
		ctrl.totalPages = result.totalPages;
	}
	searchFilter.set({ onFilter: setSearchData });

	ctrl.sortModel = null;
	function getSearchModel() {
		var searchModel = {
			q: ctrl.searchText,
			page: null,
		};

		_.each(ctrl.filterOptions, function(option){
			var filterValue = option.getValue(searchModel);
			if (filterValue) {
				searchModel[option.param] = filterValue;
			}
		});
		if (ctrl.sortModel != null)
			ctrl.setSortModel(ctrl.sortModel)

		return searchModel;
	}

	function getSelectListValues(list){
		var selectedOptions = _.where(list, { selected: true });
		return (selectedOptions.length > 0 ? _.pluck(selectedOptions, 'value') : selectedOptions);
	}

	var searchStrings = localizationService.data.directory.search;
	var styleStrings = localizationService.data.core.areas;

	breadcrumbService.setCurrentBreadcrumb(searchStrings.header);
	$scope.$on('$stateChangeStart', function(){
		breadcrumbService.clearCurrentBreadcrumb();
	});

	_.extend(ctrl, {
		isResult: function(result, match) {
			if (match=='stories' && result.discussionStyle == 'stories') return true;
			if (match=='announcements' && result.discussionStyle == 'announcements') return true;
			if (match=='forums' && result.discussionStyle == 'forums') return true;
			if (match=='topic' && result.type == 'topic') return true;
			if (match=='comment' && result.type == 'comment') return true;
		},
		setSortModel: function(sortModel){
			ctrl.sortModel = sortModel; 
			if (sortModel.sortField == 'sortNewest') {
				sortModel.params = {
					sortDir:'DESC',
					sortField:'postDate'
				}
			} else if (sortModel.sortField == 'sortOldest') {
				sortModel.params = {
					sortDir:'ASC',
					sortField:'postDate'
				}
			} else {
				sortModel.params = {
					sortField:'relevance'
				}
			}
		},
		searchSortOptions: dataService.searchSort,
		searchText: searchFilter.model('q'),
		search: function(){
			if (ctrl.searchText) {
				ctrl.searchInProgress = true;

				var searchModel = getSearchModel();
				searchFilter.filter(searchModel);
			}
		},
		searchFilter: searchFilter,
		filterOptions: {
			discussionStyles: {
				defaultOption: { display: searchStrings.discussionStyles, value: null, selected: true },
				param: 'discussionStyles',
				list: [
					{ display: styleStrings.announcements, value: 'announcements' },
					{ display: styleStrings.features, value: 'features' },
					{ display: styleStrings.forums, value: 'forums' },
					{ 
						display: styleStrings.stories, 
						value: 'stories',
						subfilters: {
							list: [
								{ param: 'featured', display: 'Featured', value: true },
								{ param: 'staffPick', display: 'Staff Pick', value: true }
							]
						}
					}  
				],
				getValue: function(filterModel){
					filterModel[this.param] = getSelectListValues(this.list);

					var subfilters = this.list[3].subfilters.list;
					_.each(subfilters, function(subfilter){
						filterModel[subfilter.param] = subfilter.selected ? subfilter.value : null;
					});

				}
			},
			postDate: {
				min: null,
				max: null,
				param: 'postDate',
				getValue: function(filterModel){
					filterModel[this.param] = {
						min: this.min,
						max: this.max
					}
				}
			}
		},
		defaultChanged: function(filterType, subfilters){
			if (filterType.defaultOption.selected) {
				_.each(filterType.list, function(filter) {
					filter.selected = false;
				});
			} else {
				//this should never happen unless a user manually un-disables the element
				filterType.defaultOption.selected = true;
			}

			ctrl.search();
		},
		filterChanged: function(filterType, changedFilter) {
			if (filterType.defaultOption) {
				var filterList = filterType.list;
				var filtersSelected = _.some(_.pluck(filterList, 'selected'));

				//if there are no filters selected, the default option should be selected
				filterType.defaultOption.selected = !filtersSelected;

				if (changedFilter && !changedFilter.selected && changedFilter.subfilters) {
					_.each(changedFilter.subfilters.list, function(subfilter){
						subfilter.selected = false;
					});
				}
			}
			ctrl.search();
		},
		allProductsDefaultChanged: function(){
			_.each(ctrl.filterOptions.productTypes.list, function(productType){
				productType.defaultOption.selected = true;
				ctrl.defaultChanged(productType);
			});

			ctrl.search();
		}
	})
};
searchPageController.$inject = [
	'$location', 
	'$scope', 
	require('services/breadcrumb.js'), 
	'CommunityLocalizationService',
	require('services/nodestructure.js'), 
	'SearchFilter',
	require('services/data.js')
];

angular.module('community.directory')
	.controller('SearchPage', searchPageController);

