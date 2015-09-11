(function(_){
	'use strict';

	var feedController = function($scope, announcementData, breadcrumbService, dataService, nodeServiceWrapper, realtimeService, routingService, feedFilter){
		var ctrl = this;
		
		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		var feedData = {
			community: {
				display: 'Community Feed',
				param: 'community'
			},
			user: {
				display: 'My Feed',
				param: 'user'
			}
		};

		feedFilter.set({
			onFilter: function(result) {
				
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

		var initialBreadcrumbSet = false;
		_.extend(ctrl, {
			currentfeed: 'user',
			feedFilter: feedFilter,
			setFeedType: function(feedType) {
				if (initialBreadcrumbSet) {
					breadcrumbService.clearCurrentBreadcrumb();
				} else {
					initialBreadcrumbSet = true;
				}

				var feedDataObject = feedData[feedType];
				breadcrumbService.setCurrentBreadcrumb(feedDataObject.display);
			},
			landingPages: routingService.landingPages(),
			discussionSortOptions: dataService.DiscussionTypeSort,
			recentAnnouncements: announcementData.collection,
			generateAnnouncementUrl: function(announcementData){
				var nodeId = routingService.generateDiscussionUrl(announcementData.product, 'announcements');
				return routingService.generateUrl('announcements.detail', { nodeId: nodeId, announcementId: announcementData.id });
			}
		});

		ctrl.setFeedType('user');
		//realtimeService.start('feed', feedFilter.filter);
	};
	feedController.$inject = [
		'$scope', 
		'AnnouncementsData',
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
