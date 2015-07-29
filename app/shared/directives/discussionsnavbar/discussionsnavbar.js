(function(_){
	'use strict';

	function discussionsNavBar() {
		function link(scope, element, attrs) {
		}

		function controller(nodeService, routingService) {
			var ctrl = this;
			// 'Forums': '-General',
			// 	'Q&A': '_QnA',
			// 	'Stories': '_Stories',
			// 	'Announcements': 'Blog_',
			// 	'Feature Requests': '_Features',
			// 	'Bugs': '_Bugs'
			var standardNavLinks = {
				'Forums': { 
					nodeString: '-General',
					urlString: routingService.areaSlugs.forums
				},
				'Q&A': {
					nodeString: '_QnA',
					urlString: routingService.areaSlugs.qna
				},
				'Stories': {
					nodeString: '_Stories',
					urlString: routingService.areaSlugs.stories
				},
				'Announcements': {
					nodeString: 'Blog_',
					urlString: routingService.areaSlugs.announcements
				},
				'Feature Requests': {
					nodeString: '_Features',
					urlString: routingService.areaSlugs.features
				},
				'Bugs': {
					nodeString: '_Bugs',
					urlString: routingService.areaSlugs.bugs
				}
			};

			nodeService.get().then(function(){
				//debugger;
			});

			// var currentNode = nodeService.CurrentNode;
			// var siblingNodeList = currentNode.parent.children;

			// _.extend(ctrl, {
			// 	navLinks: []
			// })

			// var currentAreaSlug = routingService.getCurrentArea();
			// _.each(standardNavLinks, function(searchObj, displayName){
			// 	var searchValue = searchObj.nodeString;

			// 	var navNode = _.find(siblingNodeList, function(node){
			// 		return (node.urlSlug.indexOf(searchValue) >= 0);
			// 	});
				
			// 	if (navNode) {
			// 		this.navLinks.push({ 
			// 			display: displayName, 
			// 			href: navNode.href, 
			// 			active: currentAreaSlug === searchObj.urlString,
			// 			target: function(){
			// 				return (!this.active ? '_self' : "");
			// 			} 
			// 		});
			// 	}
			// }, ctrl);
			
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