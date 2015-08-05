(function(_){
	'use strict';

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
					route: ''
				},
				'Bugs': {
					discussionType: 'bugs',
					route: ''
				}
			};

			var ctrl = this;
			nodeService.get().then(function(nodeData){
				var currentNode = nodeData.CurrentNode;
				var siblingNodeList = nodeData.parent(currentNode.id).children;

				_.extend(ctrl, {
					navLinks: []
				})

				var currentAreaSlug = routingService.getCurrentArea();
				_.each(standardNavLinks, function(searchObj, displayName){
					var navNode = _.find(siblingNodeList, function(node){
						return node.discussionType === searchObj.discussionType;
					});
					
					if (navNode) {
						var discussionHref = routingService.generateUrl(searchObj.route, { nodeId: navNode.urlCode });

						ctrl.navLinks.push({ 
							display: displayName, 
							href: discussionHref, 
							active: currentAreaSlug === searchObj.discussionType,
							target: function(){
								return (!this.active ? '_self' : "");
							} 
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
	        scope: {}
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('discussionsNavBar', discussionsNavBar);
}(window._));