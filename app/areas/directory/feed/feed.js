(function(_){
	'use strict';

	var feedController = function($scope, announcementData, apiService, breadcrumbService, dataService, nodeServiceWrapper, realtimeService, routingService, feedFilter){
		var ctrl = this;
		
		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		var feedData = {
			community: {
				display: 'Community Feed',
				param: 'community',
				dataFn: apiService.Feed.allContent
			},
			user: {
				display: 'My Feed',
				param: 'user',
				dataFn: apiService.Feed.subscriptions
			}
		};


		var initialFeedLoaded = false;
		var feedUpdates = null;
		function setFeed(feedData) {
			ctrl.feedList = feedData;
			initialFeedLoaded = true;

			feedUpdates = null;
		} 

		feedFilter.set({
			onFilter: function(result, updates) {
				debugger;
				if (!initialFeedLoaded) {
					setFeed(result.content);
				} else if (updates.length > 0) {
					feedUpdates = result.content;
				}
			}
		});

		nodeServiceWrapper.get().then(function(nodeService) {
			var categorySort = [{ value: null, label: 'All Sections', default: true }];

			var discussionTypes = _.flatten(_.toArray(nodeService.DiscussionTypes));
			var bleh = _.map(discussionTypes, function(discussionType) {
				return { value: discussionType.id, label: discussionType.description }
			});

			ctrl.categorySortOptions = categorySort.concat(bleh);
		});

		var currentFeedType = feedData.community;
		var initialBreadcrumbSet = false;
		_.extend(ctrl, {
			currentfeed: 'user',
			feedFilter: feedFilter,
			setFeedUpdates: function(){
				setFeed(feedUpdates)
			},
			hasFeedUpdates: function(){
				return feedUpdates !== null;
			},
			setFeedType: function(feedType) {
				if (initialBreadcrumbSet) {
					breadcrumbService.clearCurrentBreadcrumb();
				} else {
					initialBreadcrumbSet = true;
				}

				var feedDataObject = feedData[feedType];
				if (feedDataObject != currentFeedType) {
					feedFilter.set({
						filterFn: feedDataObject.dataFn
					});
					currentFeedType = feedDataObject;
				}

				breadcrumbService.setCurrentBreadcrumb(feedDataObject.display);
				initialFeedLoaded = false;
			},
			landingPages: routingService.landingPages(),
			discussionSortOptions: dataService.DiscussionTypeSort,
			recentAnnouncements: announcementData.collection,
			generateAnnouncementUrl: function(announcementData){
				var nodeId = routingService.generateDiscussionUrl(announcementData.product, 'announcements');
				return routingService.generateUrl('announcements.detail', { nodeId: nodeId, announcementId: announcementData.id });
			}
		});

		ctrl.setFeedType(currentFeedType.param);
	};
	feedController.$inject = [
		'$scope', 
		'AnnouncementsData',
		'CommunityApiService',
		'CommunityBreadcrumbService', 
		'CommunityDataService', 
		'CommunityNodeService', 
		'CommunityRealtimeService', 
		'CommunityRoutingService', 
		'FeedFilter'
	];

	angular.module('community.directory')
		.controller('Feed', feedController);

}(window._));
