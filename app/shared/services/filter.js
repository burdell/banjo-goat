(function(_){
	'use strict';
	
	var communityFilter = function(){
		function Filter(){
			return {
				set: function(filterFn, filterArguments){
					this.filterModel = {};
					this.filterFn = filterFn;
					this.filterArguments = filterArguments;
				},
				filter: function(filterData){
					if (filterData) {
						this.filterData(filterData);
					}

					var args = [];
					if (_.isArray(this.filterArguments)) {
						args = this.filterArguments;
					}
					args.push(this.filterModel);
					return this.filterFn.apply(this, args);
				},
				filterData: function(filterData){
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