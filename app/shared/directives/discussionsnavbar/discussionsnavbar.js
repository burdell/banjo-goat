(function(_){
	'use strict';

	function discussionsNavBar() {
		function link(scope, element, attrs) {
		    
		}

		function controller(nodeService) {
			var ctrl = this;
			
			ctrl.navLinks = [];

			var standardNavLinks = {
				'Forums': '_g',
				'Q&A': '_QnA',
				'Stories': '_Stories',
				//it's spelled wrong on the server :(
				'Announcements': '_Annoucements',
				'Feature Requests': '_Features',
				'Bugs': '_Bugs'
			};

			var currentNode = nodeService.CurrentNode;
			var siblingNodeList = currentNode.parent.children;
			_.each(standardNavLinks, function(searchValue, displayName){
				var navNode = _.find(siblingNodeList, function(node){
					return (node.urlSlug.indexOf(searchValue) >= 0);
				});
				if (navNode) {
					this.navLinks.push({ display: displayName, href: navNode.href, active: navNode === currentNode });
				}
			}, ctrl);
			
		}
		controller.$inject = ['CommunityNodeService'];
	    
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