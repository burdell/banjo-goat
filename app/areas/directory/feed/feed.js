
'use strict';

require('shared/services/api.js');
require('shared/services/data.js');
require('shared/services/nodestructure.js');
require('shared/services/routing.js');

require('shared/directives/feedcontent/feedcontent.js');
require('shared/directives/sorter/sorter.js');
require('shared/directives/pager/pager.js');
require('directives/classtoggle/classtoggle.js');


var _ = require('underscore');
var feedController = function($scope, announcementData, storyData, apiService, dataService, nodeServiceWrapper, routingService, feedFilter){
	var ctrl = this;
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


			var feedDataObject = feedData[feedType];
			ctrl.feedTypeDisplay = feedDataObject.display;
			
			if (feedDataObject != currentFeedType) {
				feedFilter.set({
					filterFn: feedDataObject.dataFn
				});
				currentFeedType = feedDataObject;
			}

			initialFeedLoaded = false;
		},
		landingPages: routingService.landingPages(),
		discussionSortOptions: dataService.DiscussionTypeSort,
		recentAnnouncements: announcementData.content,
		generateAnnouncementUrl: function(announcementData){
			return routingService.generateUrl('announcements.detail', { nodeId: announcementData.node.urlCode, announcementId: announcementData.id });
		},
		generateStoryUrl: function(storyData){
			if (!storyData) return "";

			return routingService.generateUrl('stories.detail', { nodeId: storyData.node.urlCode, storyId: storyData.id });
		}
	});

	ctrl.setFeedType(currentFeedType.param);
};
feedController.$inject = [
	'$scope', 
	'AnnouncementsData',
	'StoryData',
	'CommunityApiService',
	'CommunityDataService', 
	'CommunityNodeService', 
	'CommunityRoutingService', 
	'FeedFilter'
];

angular.module('community.directory')
	.controller('Feed', feedController);

