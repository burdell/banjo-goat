(function(_){
	'use strict';

	function mainNavBar() {
		function link(scope, element, attrs) {
		    
		}

		function controller($location, $state) {
			var ctrl = this;

			var hrefs = {
				announcements: '/announcements/',
				stories: '/stories/'
			}

			var navMetaData = [
				{ display: "Activity", href: "#"},
				{ display: "Discussions", href: "#", dropItem: true },
				{ display: "Resources", href: "#", dropItem: true },
				{ display: "Q&A", href: "#"},
				{ display: "Stories", href: "#", href: hrefs.stories },
				{ display: "Announcements", href: hrefs.announcements }
			]; 

			_.extend(ctrl, {
				navList: navMetaData,
				target: function(itemHref){
					//kind of hacky, but dont have access to currentNode at this point :(
					var currentPath = $location.path();
					return (currentPath.indexOf(itemHref) < 0 ? "_self" : "");
				},
				isActive: function(navHref) {
					var active = false;
					var currentState = $state.current.name;

					switch(navHref) {
						case hrefs.announcements: 
							active = currentState === 'announcementsLanding'
							break;
						case hrefs.stories:
							active = currentState === 'storiesLanding'
							break;
					}
					
					return active;
				}
			})			
		}
		controller.$inject = ['$location', '$state'];
	    
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