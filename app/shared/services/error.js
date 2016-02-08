
'use strict';

var errorService = function(){
	var errorList = [];

	return {
		errorList: errorList,
		showErrors: function(errorResult){		
			errorList.push(errorResult.message);
		},
		clearErrors: function(){
			errorList.length = 0;
		}
	};
};
errorService.$inject = [];

var serviceName = 'CommunityErrorService';
angular.module('community.services')
	.service(serviceName, errorService);
module.exports = serviceName;
