
'use strict';

require('directives/feedcontent/feedcontent.js');
require('directives/pager/pager.js');
require('directives/keypress/enter.js');
require('directives/datepicker/datepicker.js');
require('directives/storydisplay/storydisplay.js');
require('directives/pagescroll/pagescroll.js');

require('filters/unformattext.js');
require('filters/timefromnow.js');

var _ = require('underscore');

var searchPageController = function($location, $scope, breadcrumbService, nodeServiceWrapper, searchFilter){
	var ctrl = this;

	nodeServiceWrapper.get().then(function(nodeService){
		ctrl.getUrl = function(item) {
			return nodeService.generateNodeDetailUrl(item.node.id, item.topicId);
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

	function getSearchModel() {
		var searchModel = {
			q: ctrl.searchText,
			page: null
		};

		_.each(ctrl.filterOptions, function(option){
			var filterValue = option.getValue(searchModel);
			if (filterValue) {
				searchModel[option.param] = filterValue;
			}
		});

		return searchModel;
	}

	function getSelectListValues(list){
		var selectedOptions = _.where(list, { selected: true });
		return (selectedOptions.length > 0 ? _.pluck(selectedOptions, 'value') : selectedOptions);
	}

	breadcrumbService.setCurrentBreadcrumb('Search');
	$scope.$on('$stateChangeStart', function(){
		breadcrumbService.clearCurrentBreadcrumb();
	});

	_.extend(ctrl, {
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
				defaultOption: { display: 'Discussion Styles', value: null, selected: true },
				param: 'discussionStyles',
				list: [
					{ display: 'Announcements', value: 'announcements' },
					{ display: 'Feature Requests', value: 'features' },
					{ display: 'Forums', value: 'forums' },
					{ 
						display: 'Stories', 
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
searchPageController.$inject = ['$location', '$scope', require('services/breadcrumb.js'), require('services/nodestructure.js'), 'SearchFilter'];

angular.module('community.directory')
	.controller('SearchPage', searchPageController);

