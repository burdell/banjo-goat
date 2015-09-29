(function(_){
	'use strict';

	var feedController = function($scope, announcementData, storyData, apiService, breadcrumbService, dataService, nodeServiceWrapper, realtimeService, routingService, feedFilter){
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

		function updateFeed() {
			if (feedUpdates) {
				feedUpdates = null;
				feedFilter.filter({ page: 0 });
				feedFilter.realtimeUpdatesLoaded();
			}
		}

		feedFilter.set({
			onFilter: function(result, updates) {
				if (result) {
					ctrl.numberOfPages = result.totalPages;
				}

				if (updates && updates.content.length > 0) {
					feedUpdates = updates.content;
				} else if (result) {
					setFeed(result.content);
				}
			}
		});

		nodeServiceWrapper.get().then(function(nodeService) {
			var categorySort = [{ value: null, label: 'All Sections', default: true }];

			var discussionTypes = _.flatten(_.toArray(nodeService.DiscussionTypes));
			var bleh = _.map(discussionTypes, function(discussionType) {
				return { value: discussionType.urlCode, label: discussionType.description }
			});

			ctrl.categorySortOptions = categorySort.concat(bleh);
		});

		var currentFeedType = feedData.community;
		var initialBreadcrumbSet = false;
		_.extend(ctrl, {
			storyData: storyData.content,
			feedFilter: feedFilter,
			setFeedUpdates: function(){
				updateFeed();
			},
			hasFeedUpdates: function(){
				return feedUpdates !== null;
			},
			updateCount: function(){
				return feedUpdates && feedUpdates.length;
			},
			setFeedType: function(feedType) {
				ctrl.feedType = feedType;

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
			recentAnnouncements: announcementData.content,
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
		'StoryData',
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
