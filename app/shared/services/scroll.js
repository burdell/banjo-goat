
'use strict';

var scrollService = function($anchorScroll, $location, $timeout){
	return {
		scroll: function(scrollHash){
			$location.hash(scrollHash);
			$timeout(function(){
				$anchorScroll();
			}, 0);
		}
	};
};
scrollService.$inject = ['$anchorScroll', '$location', '$timeout'];

var serviceName = 'CommunityScrollService';
angular.module('community.services')
	.service(serviceName, scrollService);

module.exports = serviceName;

