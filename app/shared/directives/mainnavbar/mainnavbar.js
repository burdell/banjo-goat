
'use strict';

require('services/api.js')
require('services/nodestructure.js');
require('services/realtime.js');
require('services/routing.js');;
require('services/currentuser.js');

require('providers/routes.js');

require('directives/dropdown/dropdown.js');
require('directives/searchbar/searchbar.js');
require('directives/arealinkhandler/arealinkhandler.js');
require('directives/pagescroll/pagescroll.js');
require('directives/classtoggle/classtoggle.js');

var _ = require('underscore');

function mainNavBar() {
	function link(scope, element, attrs) {
	    
	}

		function controller($scope, $state, $location, apiService, nodeServiceWrapper, realtimeService, routingService, userServiceWrapper, routesProvider, $anchorScroll) {
			
			var ctrl = this;
			var hrefs = {
				announcements: routesProvider.announcements.landing,
				stories: routesProvider.stories.landing,
				feed: routesProvider.feed
			};

			var toggleDiscussionsMenu = function(){
				$scope.$broadcast('megamenu:toggleDiscussions');
				$anchorScroll("#pageTop");
			}

			var checkNotifications = function(notifcationData, updates){
				
			}

			var navMetaData = [
				{ display: "Explore", clickFn: toggleDiscussionsMenu, dropItem: true },
				{ display: "Stories", href: "#", href: hrefs.stories },
				{ display: "Announcements", href: hrefs.announcements }
			]; 

			userServiceWrapper.get().then(function(userObj){
				ctrl.isAuthenticated = userObj.isAuthenticated();
				
				var currentUser = userObj.user;
				ctrl.userHit = true;
				ctrl.currentUser = {
					login: currentUser.login,
					avatarUrl: currentUser.avatarUrl,
					profileUrl: routingService.generateUrl('userprofile', { userId: currentUser.id }),
					profileUrlTarget: routingService.getCurrentArea() === 'directory' ? '' : '_self'
				};

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
				openDropdown: function(eventName) {
					$scope.$broadcast('dropdown:' + eventName);
				},
				templateData: {
					getDiscussionUrl: function(node){
						var route = node.discussionStyle === 'category' ? 'hub' : 'forums.list';
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
			'communityRoutes',
			'$anchorScroll'
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

