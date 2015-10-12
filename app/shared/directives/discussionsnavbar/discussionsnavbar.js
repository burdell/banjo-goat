
'use strict';

var _ = require('underscore');

function discussionsNavBar() {
	function link(scope, element, attrs) {
	}

		function controller(nodeService, routingService) {
			var standardNavLinks = {
				'Forums': { 
					discussionType: 'forums',
					route: 'forums.list'
				},
				'Q&A': {
					discussionType: 'qa',
					route: ''
				},
				'Stories': {
					discussionType: 'stories',
					route: 'stories.list'
				},
				'Announcements': {
					discussionType: 'announcements',
					route: 'announcements.list'
				},
				'Feature Requests': {
					discussionType: 'features',
					route: 'features.list'
				},
				'Bugs': {
					discussionType: 'bugs',
					route: ''
				}
			};

		var ctrl = this;
		nodeService.get().then(function(nodeData){
			var currentNode = nodeData.CurrentNode;

			var parentNode = nodeData.parent(currentNode.id);

			if (!parentNode || !parentNode.children) {
				return;
			}
			
			var currentNodeSlug = currentNode && currentNode.urlCode;
			var currentAreaSlug = routingService.getCurrentArea();

			var inDirectory = currentAreaSlug === 'directory';
			var siblingNodeList = !inDirectory ? parentNode.children : currentNode.children;

			_.extend(ctrl, {
				navLinks: [{
					display: 'Home',
					href: !inDirectory ? routingService.generateUrl('hub', { nodeId: parentNode.urlCode }) : routingService.getCurrentUrl(),
					active: inDirectory
				}]
			})

			_.each(standardNavLinks, function(searchObj, displayName){
				var navNodeList = _.filter(siblingNodeList, function(node){
					return node.discussionStyle === searchObj.discussionType;
				});
				
				var navNodeCount = navNodeList.length;
				if (navNodeCount === 1) {
					var navNode = navNodeList[0];
					var discussionHref = routingService.generateUrl(searchObj.route, { nodeId: navNode.urlCode });

					ctrl.navLinks.push({ 
						display: displayName, 
						href: discussionHref, 
						active: navNode.urlCode === currentNodeSlug
					});
				} else if (navNodeCount > 1) {
				 	var subLinkList = [];
				 	_.each(navNodeList, function(subLink){
				 		subLinkList.push({
				 			display: subLink.name, 
				 			href: routingService.generateUrl(searchObj.route, { nodeId: subLink.urlCode }),
				 			active: subLink.urlCode === currentNodeSlug
						})
				 	});

					ctrl.navLinks.push({
						href: subLinkList[0].href,
						display: displayName,
						subLinks: subLinkList
					});
				 }
			}, ctrl);
		});
	}
	controller.$inject = ['CommunityNodeService', 'CommunityRoutingService'];
    
    var directive = {
        link: link,
        controller: controller,
        templateUrl: 'directives/discussionsnavbar/discussionsnavbar.html',
        restrict: 'E',
        controllerAs: 'navbar',
        bindToController: true,
        replace: true,
        scope: {
        	discussionList: '='
        }
    };

    return directive;
}

angular.module('community.directives')
	.directive('discussionsNavBar', discussionsNavBar);
