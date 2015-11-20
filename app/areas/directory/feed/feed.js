
'use strict';

require('shared/directives/feedcontent/feedcontent.js');
require('shared/directives/sorter/sorter.js');
require('shared/directives/pager/pager.js');

require('directives/loadmore/loadmore.js')
require('directives/classtoggle/classtoggle.js');
require('directives/pulse/pulse.js');

var _ = require('underscore');
var feedController = function($scope, announcementData, storyFilter, apiService, dataService, nodeServiceWrapper, routingService, feedFilter){
	var ctrl = this;
	var feedData = {
		community: {
			display: 'All Content',
			param: 'community',
			dataFn: apiService.Feed.allContent
		},
		user: {
			display: 'My Content',
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
			} else if (result && !feedFilter.model('page')) {
				setFeed(result);
			}
		}
	});

	storyFilter.set({
		onFilter: function(result) {
			ctrl.storyData = result.content;
		}
	})

	$scope.$on('$destroy', function(){
		feedFilter.stopRealtime();
	});

	nodeServiceWrapper.get().then(function(nodeService) {
		var categorySort = [{ value: null, label: 'All Sections', default: true }];

		var discussionTypes = _.flatten(_.toArray(nodeService.DiscussionTypes));
		var bleh = _.map(discussionTypes, function(discussionType) {
			return { value: discussionType.urlCode, label: discussionType.description }
		});
		ctrl.categorySortOptions = categorySort.concat(bleh);

		ctrl.setDiscussionStyleList = function(nodeUrlCode){
			var node = null;
			var feedFilterModel = feedFilter.model();
			if (nodeUrlCode) {
				node = nodeService.getNode(feedFilterModel.nodeUrlCode);
			}

			var showDiscussionTypes = []

			if (!node) {
				//ALL DISCUSSION TYPES SHOWN \o/
				ctrl.discussionSortOptions = dataService.DiscussionTypeSort;
			} else {

				//discussion types for individual node
				var nodeDiscussionStyles = _.pluck(node.children, 'discussionStyle');
				var discussionTypes = [];

				_.each(dataService.DiscussionTypeSort, function(sortOption){
					if (!sortOption.value || _.indexOf(nodeDiscussionStyles, sortOption.value) >= 0) {
						discussionTypes.push(sortOption);
					}
				});
				ctrl.discussionSortOptions = discussionTypes;
			}
			
			ctrl.checkStoryData();
		}

		ctrl.checkStoryData = function(node){
			var feedFilterModel = feedFilter.model();
			var discussionStyle = feedFilterModel.style;
			var nodeUrlCode = feedFilterModel.nodeUrlCode;

			if (nodeUrlCode && !node) {
				node = nodeService.getNode(nodeUrlCode);
			}

			var currentDiscussionStyles = _.pluck(ctrl.discussionSortOptions, 'value');
			var hasStories =  !node || discussionStyle === 'stories' || (!discussionStyle &&  _.indexOf(currentDiscussionStyles, 'stories') >= 0);
			if (hasStories) {
				ctrl.showStoryData = true;
				var nodeUrlCode = node ? routingService.generateDiscussionUrl(feedFilterModel.nodeUrlCode, 'stories') : null;
				storyFilter.filter({ nodeUrlCode: nodeUrlCode });
			} else {
				ctrl.showStoryData = false;
			}
		}
	});

	var landingPages = routingService.landingPages();
	var announcementsLanding = _.where(landingPages, { area: 'Announcements' });
	
	var currentFeedType = feedData.community;
	_.extend(ctrl, {
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
		announcementsLanding: announcementsLanding[0],
		landingPages: landingPages,
		discussionSortOptions: dataService.DiscussionTypeSort,
		recentAnnouncements: announcementData.content,
		generateAnnouncementUrl: function(announcementData){
			return routingService.generateUrl('announcements.detail', { nodeId: announcementData.topic.node.urlCode, announcementId: announcementData.id });
		},
		generateStoryUrl: function(storyData){
			if (!storyData) return "";

			return routingService.generateUrl('stories.detail', { nodeId: storyData.node.urlCode, storyId: storyData.id });
		},
		showStoryData: true
	});
	ctrl.setFeedType(currentFeedType.param);
};
feedController.$inject = [
	'$scope', 
	'AnnouncementsData',
	'StoryFilter',
	require('shared/services/api.js'),
	require('shared/services/data.js'), 
	require('shared/services/nodestructure.js'), 
	require('shared/services/routing.js'), 
	'FeedFilter'
];

angular.module('community.directory')
	.controller('Feed', feedController);

