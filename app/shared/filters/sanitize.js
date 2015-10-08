
'use strict';

var sanitize = function($sce){
	return function(html){
		return $sce.trustAsHtml(html);
	};
};
sanitize.$inject = ['$sce'];

angular.module('community.filters')
	.filter('sanitize', sanitize);

