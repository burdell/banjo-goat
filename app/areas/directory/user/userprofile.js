(function(_){
	'use strict';

	var profileController = function($scope, breadcrumbService, communityDefaults, activityFilter, storyFilter, userData){
		var ctrl = this;

		var pointCategoryMappings = {
			ANNOUNCEMENT_REPLY: { title: 'Announcement Reply', description: 'Reply to an Announcement' },
			ANNOUNCEMENT_TOPIC: { title: 'Announcements', description: 'Post an Announcement' },
			FEATURE_REPLY: { title: 'Feature Requests Replies', description: 'Reply to a feature request' },
			FEATURE_TOPIC: { title: 'Feature Requests', description: 'Request a new feature' },
			FEATURE_UPVOTE_GIVEN: { title: 'Feature Request Upvotes Given', description: 'Give an upvote to a posted feature request' },
			FEATURE_UPVOTE_RECEIVED: { title: 'Feature Request Upvotes Received', description: 'Receive an upvote for a feature you posted' },
			FORUM_HELPFUL_GIVEN: { title: 'Helpful Forum Replies Votes Given', description: 'Votes helpful replies on a forum topic' },
			FORUM_HELPFUL_RECEIVED: { title: 'Helpful Forum Replies Votes Received', description: 'Receive a helpful vote for your reply to a topic' },
			FORUM_KUDO_GIVEN: { title: 'Forum Kudos Given', description: 'Give kudoes to a message on the forum' },
			FORUM_KUDO_RECEIVED: { title: 'Forum Kudos Received', description: 'Receive kudos for a message you posted on the forum' },
			FORUM_REPLY: { title: 'Forum Replies', description: 'Post a reply to a topic on the forum' },
			FORUM_TOPIC: { title: 'Forum Topics', description: 'Post a new topic on a forum' },
			STORY_FEATURED: { title: 'Featured Stories', description: 'Post a story and have it featured in the Community' },
			STORY_REPLY: { title: 'Story Replies', description: 'Reply to a story' },
			STORY_STAFF_PICK: { title: 'Staff Picked Stories', description: 'Post a story and have it picked by staff to be features in the Community' },
			STORY_TOPIC: { title: 'Story Topics', description: 'Post a story' },
			STORY_UPVOTE_GIVEN: { title: 'Story Upvotes Given', description: 'Give upvotes to a story' },
			STORY_UPVOTE_RECEIVED: { title: 'Story Upvotes Received', description: 'Post a story and receive upvotes' }
		};

		var userPointData = userData.user.gamification;

		var userPointDetails = userPointData.details;
		_.each(pointCategoryMappings, function(categoryData, categoryKey){
			_.extend(categoryData, {
				count: userPointDetails[categoryKey],
				score: userPointDetails[categoryKey + '_SCORE']
			});
		});

		var categoriesWithPoints = _.filter(pointCategoryMappings, function(category){
			return category.count > 0;
		});

		activityFilter.set({ 
			onFilter: function(result){
				var existingList = ctrl.activityList || [];
				ctrl.activityList = existingList.concat(result.content);
			} 
		});

		storyFilter.set({
			onFilter: function(result){
				ctrl.totalStories = result.totalElements;

				var existingList = ctrl.storyList || [];
				ctrl.storyList = existingList.concat(result.content);
			}
		})

		var filters = {
			stories: storyFilter,
			activity: activityFilter
		};

		_.extend(ctrl, {
			userData: userData.user,
			allCategories: pointCategoryMappings,
			pointCategories: categoriesWithPoints,
			totalPoints: userPointData.score,
			percentageComplete: (userPointData.score / userPointData.nextRank.minScore) * 100,
			profileSummaryShown: true,
			loadMore: function(type){
				var filter = filters[type];

				var page = filter.model('page') || 1;
				filter.filter({ page: page + 1 });
			}
		});

		breadcrumbService.setCurrentBreadcrumb(userData.user.login);
		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});
	};
	profileController.$inject = ['$scope', 'CommunityBreadcrumbService', 'communityDefaults', 'ActivityDataFilter', 'StoryDataFilter', 'UserData'];

	angular.module('community.directory')
		.controller('UserProfile', profileController);

}(window._));