(function(_){
	'use strict';
	
	var communityFilter = function($location, utils){
		function Filter(){
			var options = {
				filterModel: {},
				constants: {},
				filterFn: null,
				filterArguments: null,
				onFilterFns: [],
				setInitialData: true,
				initialData: null,
				filterContext: null
			};

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

			var executeOnFilterFns = function(result){
				_.each(options.onFilterFns, function(fn){
					fn(result);
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
					
					return filter;
				},
				filter: function(filterData, exclude){
					if (filterData) {
						setFilterModel(filterData, exclude);
					}

					var args = [];
					if (_.isArray(options.filterArguments)) {
						args = _.clone(options.filterArguments);
					}
					
					var filterModel = _.extend(options.filterModel, options.constants);
					args.push(filterModel);

					var filterContext = options.filterContext ? options.filterContext : this;
					return options.filterFn.apply(filterContext, args).then(function(result){
						setQueryParams(filterModel);
						executeOnFilterFns(result);
						
						return result;
					});
				},
				model: function(modelValue){
					return (modelValue ? options.filterModel[modelValue] : options.filterModel);
				}
			};
		}

		return {
			getNewFilter: function(options){
				if (options.autoInitModel) {
					options.filterModel = $location.search();
				}

				return new Filter().set(options);
			}
		};
	};
	
	communityFilter.$inject = ['$location', 'CommunityUtilsService'];

	angular.module('community.services')
		.service('CommunityFilterService', communityFilter);
		
}(window._));