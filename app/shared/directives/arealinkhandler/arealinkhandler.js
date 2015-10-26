
'use strict';

require('services/routing.js');

function areaLinkHandler($parse, $timeout, routingService) {
	var link = function(scope, element, attrs) {
		var elementHref;
		$timeout(function(){
			if (attrs.linkHandlerRoute) {
				var routeValues = !attrs.routeValues ? null : $parse(attrs.routeValues)();
				elementHref = routingService.generateUrl(attrs.linkHandlerRoute, routeValues);
			} else {
				elementHref = attrs.areaLinkHandler;
			}	
			
			var elementNode = element[0];
			elementNode.setAttribute('href', elementHref);
			
			if (routingService.getCurrentArea() !== routingService.getArea(elementHref)) {
				elementNode.setAttribute('target', '_self');
			}
		});
	};
	
    var directive = {
    	link: link,
        restrict: 'A',
        scope: true,
        replace: true
    };
    return directive;
}
areaLinkHandler.$inject = ['$parse', '$timeout', 'CommunityRoutingService'];

angular.module('community.directives')
	.directive('areaLinkHandler', areaLinkHandler);
	
