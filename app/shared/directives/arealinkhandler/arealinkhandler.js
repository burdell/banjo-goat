(function(_){
	'use strict';
	
	function areaLinkHandler(routingService) {
		var link = function(scope, element, attrs) {
			var elementHref = attrs.areaLinkHandler;

			var elementNode = element[0];
			elementNode.setAttribute('href', elementHref);

			if (routingService.getCurrentArea() !== routingService.getArea(elementHref)) {
				elementNode.setAttribute('target', '_self');
			}
		};
		
	    var directive = {
	    	link: link,
	        restrict: 'A',
	        scope: true
	    };
	    return directive;
	}
	areaLinkHandler.$inject = ['CommunityRoutingService'];

	angular.module('community.directives')
		.directive('areaLinkHandler', areaLinkHandler);
		
}(window._));