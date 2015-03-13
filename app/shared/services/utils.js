(function(_) {
	'use strict';
	
	var utils = function(){
		return {
			splitCsv: function(csvString) {
				if (_.isUndefined(csvString) || _.isNull(csvString)) {
					return;
				}

				return _.map(csvString.split(','), function(string){
					return string.trim();
				});
			}	
		};
	};
	
	utils.$inject = [];

	angular.module('community.shared')
		.service('CommunityUtilsService', utils);

}(window._));