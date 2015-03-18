(function(_){
	'use strict';
	
	var communityFilter = function(){
		function Filter(){
			return {
				set: function(filterModel, filterFn, filterArguments){
					this.filterModel = filterModel;
					this.filterFn = filterFn;
					this.filterArguments = filterArguments;
				},
				filter: function(sourceList){
					var args = [];
					if (_.isArray(this.filterArguments)) {
						args = this.filterArguments;
					}
					args.push(this.filterModel);
					return this.filterFn.apply(this, args);
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