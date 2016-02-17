
'use strict';

var scrollService = function($anchorScroll, $location, $timeout, $document){
	return {
		scroll: function(scrollHash){
			if (scrollHash) {
				$location.hash(scrollHash);
			}

			$timeout(function(){
				var target = angular.element(document.getElementById($location.hash()));

	            var offset = 50;
	            var duration = 220; //milliseconds
				$document.scrollToElement(target, offset, duration);
			}, 0);
		}
	};
};
scrollService.$inject = ['$anchorScroll', '$location', '$timeout', '$document'];

var serviceName = 'CommunityScrollService';
angular.module('community.services')
	.service(serviceName, scrollService);

module.exports = serviceName;

