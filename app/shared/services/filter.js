(function(_){
	'use strict';
	
	var communityFilter = function(){
		function Filter(){
			return {
				set: function(filterFn, filterArguments, initialModel){
					this.filterModel = initialModel;
					this.filterFn = filterFn;
					this.filterArguments = filterArguments;
					
					return this;

				},
				filter: function(filterData, exclude){
					if (filterData) {
						this.setFilterModel(filterData, exclude);
					}

					var args = [];
					if (_.isArray(this.filterArguments)) {
						args = _.clone(this.filterArguments);
					}
					
					args.push(this.filterModel);
					return this.filterFn.apply(this, args);
				},
				setFilterModel: function(filterData, exclude){
					if (exclude) {
						var values = [];
						values.length = exclude.length;

						var excludeObject = _.object(exclude, values);
						filterData = _.extend(filterData, excludeObject);
					}
					
					this.filterModel = _.extend(this.filterModel, filterData);
					
					return this.filterModel;
				}
			};
		}

		return {
			getNewFilter: function(){
				return new Filter(); 
			}
		};
	};
	
	communityFilter.$inject = [];

	angular.module('community.shared')
		.service('CommunityFilterService', communityFilter);
		
}(window._));