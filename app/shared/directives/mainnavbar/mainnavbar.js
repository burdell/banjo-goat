(function(_){
	'use strict';

	function mainNavBar() {
		function link(scope, element, attrs) {
		    
		}

		function controller($scope, $state, $location, apiService, nodeServiceWrapper, realtimeService, routingService, userServiceWrapper, routesProvider) {
			var ctrl = this;
			var hrefs = {
				announcements: routesProvider.announcements.landing,
				stories: routesProvider.stories.landing,
				feed: routesProvider.feed
			};

			var toggleDiscussionsMenu = function(){
				$scope.$broadcast('megamenu:toggleDiscussions');
			}

			var checkNotifications = function(notifcationData, updates){
				
			}

			var navMetaData = [
				{ display: "Discussions", clickFn: toggleDiscussionsMenu, dropItem: true },
				{ display: "Q&A", href: "#"},
				{ display: "Stories", href: "#", href: hrefs.stories },
				{ display: "Announcements", href: hrefs.announcements }
			]; 

			var currentUser = null;
			userServiceWrapper.get().then(function(userObj){
				ctrl.isAuthenticated = userObj.isAuthenticated();
				currentUser = userObj.user;

				if (ctrl.isAuthenticated) {
					//realtimeService.getNew().start(apiService.Feed.notifications, true, checkNotifications)
				}
 			});

			nodeServiceWrapper.get().then(function(nodeService){
				ctrl.templateData.discussionTypes = nodeService.DiscussionTypes;
			});

			_.extend(ctrl, {
				navList: navMetaData,
				target: function(itemHref){
					//kind of hacky, but dont have access to currentNode at this point :(
					var currentPath = $location.path();
					return (currentPath.indexOf(itemHref) < 0 ? "_self" : "");
				},
				isAuthenticated: false,
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
				},
				templateData: {
					getDiscussionUrl: function(node){
						var route = node.discussionType === 'category' ? 'hub' : 'forums.list';
						return routingService.generateUrl(route, { nodeId: node.urlCode });
					},
					linksTarget: routingService.getCurrentArea() === 'directory' ? '' : '_self',
					directoryUrl: routingService.generateUrl('directory')
				}
			})			
		}
		controller.$inject = [
			'$scope', 
			'$state',
			'$location', 
			'CommunityApiService',
			'CommunityNodeService', 
			'CommunityRealtimeService',
			'CommunityRoutingService', 
			'CurrentUserService',
			'communityRoutes'
		];
	    
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
