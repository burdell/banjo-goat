(function(_){
	'use strict';
	
	var communityFilter = function($location, utils){
		function Filter(){
			var options = {
				filterModel: {},
				filterFn: null,
				filterArguments: null,
				onFilter: null
			};

			var setFilterModel = function(filterData, exclude) {
				if (exclude) {
					if (!_.isArray(exclude)) {
						exclude = utils.splitCsv(exclude)
					}
					
					var values = [];
					values.length = exclude.length;

					var excludeObject = _.object(exclude, values);
					filterData = _.extend(filterData, excludeObject);
				}
				
				options.filterModel = _.extend(options.filterModel, filterData);
			};

			return {
				set: function(newOptions){
					_.extend(options, newOptions);

					return this;
				},
				filter: function(filterData, exclude){
					if (filterData) {
						setFilterModel(filterData, exclude);
					}

					var args = [];
					if (_.isArray(options.filterArguments)) {
						args = _.clone(options.filterArguments);
					}
					
					var filterModel = options.filterModel;
					args.push(filterModel);
					
					return options.filterFn.apply(this, args).then(function(result){
						$location.search(filterModel);

						if (options.onFilter) {
							options.onFilter(result);
						}

						return result;
					});
				}
			};
		}

		return {
			getNewFilter: function(options){
				return new Filter().set(options);
			}
		};
	};
	
	communityFilter.$inject = ['$location', 'CommunityUtilsService'];

	angular.module('community.services')
		.service('CommunityFilterService', communityFilter);
		
}(window._));