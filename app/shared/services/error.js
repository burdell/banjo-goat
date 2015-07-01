(function(_) {
	'use strict';
	
	var errorService = function(){
		var errorList = [];

		return {
			errorList: errorList,
			showErrors: function(errorResult){
				errorList.push(errorResult.statusText);
			},
			clearErrors: function(){
				errorList.length = 0;
			}
		};
	};
	errorService.$inject = [];

	angular.module('community.services')
		.service('CommunityErrorService', errorService);

}(window._));