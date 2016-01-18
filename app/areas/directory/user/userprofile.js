
'use strict';

var _ = require('underscore');

require('directives/storydisplay/storydisplay.js');
require('services/breadcrumb.js');
require('providers/defaults.js');

var profileController = function($scope, breadcrumbService, communityDefaults, activityFilter, gamificationInfo, storyFilter, userData){
	var ctrl = this;

	var userPointData = userData.user.gamification;

	var userPointDetails = userPointData.details;		
	var categoriesWithScore = [];
	var categoriesWithPoints = [];

	_.each(gamificationInfo, function(categoryData){
		var categoryKey = categoryData.key;

		_.extend(categoryData, {
			count: userPointDetails[categoryKey],
			score: userPointDetails[categoryKey + '_SCORE']
		});
		
		categoriesWithScore.push(categoryData);
		categoriesWithPoints.push(categoryData);
	});
	
	activityFilter.set({ 
		onFilter: function(result){
			ctrl.hasMoreActivity = !result.last;

			var existingList = ctrl.activityList || [];
			ctrl.activityList = existingList.concat(result.content);
		} 
	});

	storyFilter.set({
		onFilter: function(result){
			ctrl.totalStories = result.totalElements;
			ctrl.hasMoreStories = !result.last;

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
		allCategories: gamificationInfo,
		scoreCategories: categoriesWithScore,
		pointCategories: categoriesWithPoints,
		totalPoints: userPointData.score,
		nextRankName: userPointData.nextRank.name,
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
profileController.$inject = ['$scope', 'CommunityBreadcrumbService', 'communityDefaults', 'ActivityDataFilter', 'GamificationInfo', 'StoryDataFilter', 'UserData'];

angular.module('community.directory')
	.controller('UserProfile', profileController);

