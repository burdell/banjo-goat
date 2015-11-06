
'use strict';

require('directives/dropdown/dropdown.js');
require('directives/searchbar/searchbar.js');
require('directives/arealinkhandler/arealinkhandler.js');
require('directives/pagescroll/pagescroll.js');
require('directives/classtoggle/classtoggle.js');

require('filters/unformattext.js');
require('filters/wordcut.js');

require('services/notifications.js');

var _ = require('underscore');

function mainNavBar() {
	function controller($scope, $state, $location, apiService, nodeServiceWrapper, realtimeService, routingService, userServiceWrapper, routesProvider, notificationService) {
		
		var ctrl = this;
		var hrefs = {
			announcements: routesProvider.announcements.landing,
			stories: routesProvider.stories.landing,
			feed: routesProvider.feed
		};

		var toggleDiscussionsMenu = function(){
			$scope.$broadcast('megamenu:toggleDiscussions');
		};

		var navMetaData = [
			{ display: "All Topics", clickFn: toggleDiscussionsMenu, dropItem: true },
			{ display: "Stories", href: "#", href: hrefs.stories },
			{ display: "Announcements", href: hrefs.announcements }
		]; 

		/*** NOTIFICATIONS / MESSAGE STUFF ***/
		var pollers = {
			notifications: null,
			messages: null
		};

		function resetDisplayCount(type) {
			ctrl[type].newDataCount = 0;
		};

		function getData(type){
			var dataType = ctrl[type];

			if (dataType.list.length === 0 || dataType.newDataCount) {
				dataType.loading = true;
				
				apiService.Feed[type]({ size: 7 }).then(function(result) {
					dataType.list = result.content;
					dataType.loading = false;
					debugger;
					dataType.newDataCount = 0;
					pollers[type].resetTimestamp();
				});
			}
		}

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
				pollers.notifications = realtimeService.getNew();
				pollers.notifications.start(
					function(model){ return apiService.Feed.count('notifications', model); }, 
					true, 
					function(result){ ctrl.notifications.newDataCount = result; }, 
					{ since: userObj.user.lastCheckedNotifications }
				);
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
			},
			notifications: {
				list: [],
				newDataCount: 0,
				getActionString: function(notification) {
				 	return notificationService.getActionString(notification);
				},
				loading: false,
				getData: function(){
					getData('notifications');
				},
				getUrl: function(data) {
					return notificationService.generateNotificationUrl(data);
				}
			},
			messages: {
				list: [],
			 	newDataCount: 0,
			 	getUrl: function(data) {
					return generateContentUrl(data);
				}
			}
		 });			
	}
	controller.$inject = [
		'$scope', 
		'$state',
		'$location', 
		require('services/api.js'),
		require('services/nodestructure.js'), 
		require('services/realtime.js'),
		require('services/routing.js'), 
		require('services/currentuser.js'),
		require('providers/routes.js'),
		'CommunityNotificationsService'
	];
    
    var directive = {
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

