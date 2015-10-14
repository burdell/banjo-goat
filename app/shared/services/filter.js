
'use strict';

require('services/realtime.js');
require('services/utils.js');

var _ = require('underscore');
var communityFilter = function($location, realtimeServiceWrapper, utils){
	function Filter(){
		var options = {
			filterModel: {},
			constants: {},
			filterFn: null,
			filterArguments: null,
			onFilterFns: [],
			setInitialData: true,
			initialData: null,
			filterContext: null,
			persistFilterModel: true
		};

			var realtimeService = null;

			var setFilterModel = function(filterData, exclude) {
				if (exclude) {
					if (!_.isArray(exclude)) {
						exclude = utils.splitCsv(exclude);
					}
					
					var values = [];
					values.length = exclude.length;

				var excludeObject = _.object(exclude, values);
				filterData = _.extend(filterData, excludeObject);
			}
			
			options.filterModel = _.extend(options.filterModel, filterData);
		};

			var executeOnFilterFns = function(result, filterModel){
				var updates;
				if (options.realtime && filterModel.since) {
					updates = result;
					result = null;
				}
				_.each(options.onFilterFns, function(fn){
					fn(result, updates);
				});
			};

		var setQueryParams = function(queryModel) {
			var queryParams = {};
			_.each(queryModel, function(value, key) {
				if (_.isUndefined(options.constants[key])) {
					queryParams[key] = value;
				}
			});
			$location.search(queryParams);
		};


			return {
				set: function(newOptions){
					var filter = this;	
					_.extend(options, newOptions);
					if (newOptions.onFilter) {
						options.onFilterFns.push(newOptions.onFilter);

						if (options.initialData) {
							newOptions.onFilter(options.initialData);
							options.initialData = null;
						}
					} else if (options.setInitialData) {
						return this.filter(this.filterModel).then(function(result){
							options.initialData = result;
							return filter;
						});
					}
					
					if (options.realtime && !realtimeService) {
						realtimeService = realtimeServiceWrapper.getNew();
						var filterFn = this.filter;
						realtimeService.start(function(realtimeModel){
							//keep any sorts, exclude paging information
							realtimeModel = _.extend(realtimeModel, options.filterModel, { page: undefined, size: undefined });
							return filterFn(realtimeModel, null, true);
						});
					}

					return filter;
				},
				filter: function(filterData, exclude, oneTime){
					var filterModel;
					if (oneTime) {
						filterModel = filterData;
					} else {
						if (filterData) {
							setFilterModel(filterData, exclude);
						}
						filterModel = _.extend(options.filterModel, options.constants);
					}

					var args = [];
					if (_.isArray(options.filterArguments)) {
						args = _.clone(options.filterArguments);
					}
					
					//make sure falsy values are undefined
					_.each(filterModel, function(modelValue, key) {
						if (!modelValue && modelValue !== 0) {
							filterModel[key] = undefined;
						}
					});
					args.push(filterModel);

					var filterContext = options.filterContext ? options.filterContext : this;
					return options.filterFn.apply(filterContext, args).then(function(result){
						if (!oneTime && options.persistFilterModel) {
							setQueryParams(filterModel);
						}
						executeOnFilterFns(result, filterModel);
						
						return result;
					});
				},
				model: function(modelValue){
					return (modelValue ? options.filterModel[modelValue] : options.filterModel);
				},
				initialData: function(){
					var initialData = options.initialData;
					options.initialData = null;
					return initialData;
				},
				realtimeUpdatesLoaded: function(){
					if (realtimeService) {
						realtimeService.resetTimestamp();
					}
				}
			};
		}

	return {
		getNewFilter: function(options){
			if (options.autoInitModel !== false || options.persistFilterModel !== false) {
				options.filterModel = $location.search();
			}

				return new Filter().set(options);
			}
		};
	};
	
	communityFilter.$inject = ['$location', 'CommunityRealtimeService', 'CommunityUtilsService'];

angular.module('community.services')
	.service('CommunityFilterService', communityFilter);
	
