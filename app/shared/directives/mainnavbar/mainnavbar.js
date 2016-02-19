
'use strict';

require('directives/dropdown/dropdown.js');
require('directives/searchbar/searchbar.js');
require('directives/arealinkhandler/arealinkhandler.js');
require('directives/pagescroll/pagescroll.js');
require('directives/classtoggle/classtoggle.js');

require('filters/unformattext.js');
require('filters/wordcut.js');

require('services/notifications.js');
require('services/currentuser');
require('services/inbox.js');

var _ = require('underscore');

function mainNavBar() {
	function controller($rootScope, $scope, $state, $location, apiService, localizationService, nodeServiceWrapper, realtimeService, routingService, userServiceWrapper, routesProvider, notificationService, inboxService) {
		
		var ctrl = this;
		var hrefs = {
			announcements: routesProvider.announcements.landing,
			stories: routesProvider.stories.landing,
			feed: routesProvider.feed
		};

		var toggleDiscussionsMenu = function(){
			$scope.$broadcast('megamenu:toggleDiscussions');
		};

		var localizedAreas = localizationService.data.core.areas;
		var navMetaData = [
			{ display: localizationService.data.directives.mainnavbar.topics, clickFn: toggleDiscussionsMenu, topics: true },
			{ display: localizedAreas.stories, href: "#", href: hrefs.stories },
			{ display: localizedAreas.announcements, href: hrefs.announcements }
		]; 

		/*** NOTIFICATIONS / MESSAGE STUFF ***/
		var pollers = {
			notifications: null,
			inbox: null
		};

		var services = {
			notifications: notificationService,
			inbox: inboxService
		};

		var limitVariable = {
			notifications: 'size',
			inbox: 'per_page'
		}

		function resetDisplayCount(type) {
			services[type].newDataCount = 0;
		};

		function getData(type){
			var dataType = ctrl[type];

			if (dataType.list.length === 0 || dataType.newDataCount) {
				dataType.loading = true;
				var model = {};
				model[limitVariable[type]] = 7;
				apiService.Feed[type](model).then(function(result) {
					dataType.list = result.content;
					dataType.loading = false;
					pollers[type].resetTimestamp();
					services[type].newDataCount = 0;
				});
			}
		}
		
		
		$rootScope.$on('rootScope:openSearchbar', function(){
			ctrl.searchIsOpen = true;
		});

		$rootScope.$on('rootScope:closeSearchbar', function(){
			ctrl.searchIsOpen = false;
		});
		
		

		userServiceWrapper.get().then(function(userObj){
			ctrl.isAuthenticated = userObj.isAuthenticated();
			
			var currentUser = userObj.user;
			ctrl.userHit = true;
			ctrl.currentUser = {
				login: currentUser.login,
				avatarUrl: currentUser.avatarUrl,
				profileUrl: routingService.generateUrl('userprofile', { userId: currentUser.login }),
				profileUrlTarget: routingService.getCurrentArea() === 'directory' ? '' : '_self'
			};

			if (ctrl.isAuthenticated) {
				pollers.notifications = realtimeService.getNew();
				pollers.notifications.start(
					function(model){ return apiService.Feed.count('notifications', model); }, 
					true, 
					function(result){ notificationService.newDataCount = result; }, 
					{ since: userObj.user.lastCheckedNotifications }
				);
				
				pollers.inbox = realtimeService.getNew();
				pollers.inbox.start(
					function(model){ return apiService.Feed.count('inbox', model); }, 
					true, 
					function(result){ 
						inboxService.newDataCount = result; 
					}, 
					{ since: userObj.user.lastCheckedInbox }
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
			isHome: function () {
				return $state.current.name === 'feed';
			},
			isSearch: function () {
				return $state.current.name === 'searchpage';
			},
			openDropdown: function(eventName) {
				$scope.$broadcast('dropdown:' + eventName);
			},
			searchIsOpen: false,
			searchOpen: function(){
				
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
				newDataCount: function(){
					notificationService.newDataCount;
				},
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
			inbox: {
				list: [],
			 	newDataCount: function(){
			 		return inboxService.newDataCount;
			 	},
			 	getUrl: function(data) {
			 		return routingService.generateUrl('inbox.detail', { messageId: data.topic.id });
				},
				getData: function(){
					getData('inbox');
				},
				getRecipientString: function(recipientData){
					return inboxService.getRecipientString(recipientData);
				}
			}
		 });			
	}
	controller.$inject = [
		'$rootScope',
		'$scope', 
		'$state',
		'$location', 
		require('services/api.js'),
		'CommunityLocalizationService',
		require('services/nodestructure.js'), 
		require('services/realtime.js'),
		require('services/routing.js'), 
		'CurrentUserService',
		require('providers/routes.js'),
		'CommunityNotificationsService',
		'CommunityInboxService'
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

