(function(_){
	'use strict';

	function mainNavBar() {
		function link(scope, element, attrs) {
		    
		}

		function controller($location) {
			var ctrl = this;

			var navMetaData = [
				{ display: "Activity", href: "#"},
				{ display: "Discussions", href: "#", dropItem: true },
				{ display: "Resources", href: "#", dropItem: true },
				{ display: "Q&A", href: "#"},
				{ display: "Stories", href: "#"},
				{ display: "Announcements", href: "/announcements/"}
			]; 

			_.extend(ctrl, {
				navList: navMetaData,
				target: function(itemHref){
					//kind of hacky, but dont have access to currentNode at this point :(
					var currentPath = $location.path();
					return (currentPath.indexOf(itemHref) < 0 ? "_self" : "");
				}
			})			
		}
		controller.$inject = ['$location'];
	    
	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/mainnavbar/mainnavbar.html',
	        restrict: 'E',
	        controllerAs: 'mainnavbar',
	        bindToController: true,
	        replace: true,
	        scope: {}
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('mainNavBar', mainNavBar);
}(window._));