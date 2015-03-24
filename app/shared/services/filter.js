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
				filter: function(filterData){
					if (filterData) {
						this.setFilterModel(filterData);
					}

					var args = [];
					if (_.isArray(this.filterArguments)) {
						args = _.clone(this.filterArguments);
					}
					
					args.push(this.filterModel);
					return this.filterFn.apply(this, args);
				},
				setFilterModel: function(filterData){
					if (!_.isUndefined(filterData)) {
						this.filterModel = _.extend(this.filterModel, filterData);
					}
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