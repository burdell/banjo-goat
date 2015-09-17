(function(_) {
	'use strict';
	
	var utils = function($templateCache){
		return {
			splitCsv: function(csvString) {
				if (_.isUndefined(csvString) || _.isNull(csvString)) {
					return;
				}

				return _.map(csvString.split(','), function(string){
					return string.trim();
				});
			},
			preventBodyScroll: function(shouldPrevent) {
				if (_.isUndefined(shouldPrevent)) {
					shouldPrevent = true;
				}
				
				var bodyTag = document.body;
				var className = 'cmuWrapper--overlay';
				if (shouldPrevent) {
					bodyTag.classList.add(className);	
				} else {
					bodyTag.classList.remove(className);
				}
			}	
		};
	};
	
	utils.$inject = [];

	angular.module('community.services')
		.service('CommunityUtilsService', utils);

}(window._));