
'use strict';

require('services/routing.js');

function areaLinkHandler($parse, $timeout, routingService, currentUserWrapper) {
	var link = function(scope, element, attrs) {
		function setHref(elementHref) {
			var elementNode = element[0];
			elementNode.setAttribute('href', elementHref);
			
			if (routingService.getCurrentArea() !== routingService.getArea(elementHref)) {
				elementNode.setAttribute('target', '_self');
			}
		}

		function getHref() {
			var routeValues = !attrs.routeValues ? null : $parse(attrs.routeValues)();
			return routingService.generateUrl(attrs.linkHandlerRoute, routeValues);
		}

		$timeout(function(){
			var elementHref;

			if (attrs.useCurrentUser !== 'true') {
				elementHref = attrs.linkHandlerRoute ? getHref() : attrs.areaLinkHandler;
				setHref(elementHref);
			} else {
				currentUserWrapper.get().then(function(userService){
					elementHref = routingService.generateUrl(attrs.linkHandlerRoute, { userId: userService.user.login });
					setHref(elementHref);
				});
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
areaLinkHandler.$inject = ['$parse', '$timeout', 'CommunityRoutingService', require('services/currentuser')];

angular.module('community.directives')
	.directive('areaLinkHandler', areaLinkHandler);
	
