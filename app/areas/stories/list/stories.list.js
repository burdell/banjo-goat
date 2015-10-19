
'use strict';

require('services/data.js');

require('directives/sorter/sorter.js');
require('directives/loadmore/loadmore.js');
require('directives/storydisplay/storydisplay.js');

require('stories/list/fluidlayout.js');


var _ = require('underscore');

function StoriesListController ($scope, storyFilter, breadcrumbService, dataService, storyDefaults, $state){
	var ctrl = this;
	var intitialList = storyFilter.initialData();

	var isStoriesLanding = $state.current.name === 'storiesLanding';

	_.extend(ctrl, {
		storyFilter: storyFilter,
		storyList: intitialList,
		sortOptions: dataService.MessageSort,
		createStory: function(){
			$state.go('stories.new');
		},
		defaultPhoto: storyDefaults.coverPhoto,
		groupStoryData: function(newData){
			_.each(newData, function(story) {
				ctrl.storyList.content.push(story);
			});

			$scope.$broadcast('communityGridList:redraw');
		},
		hideNewStoryButton: isStoriesLanding
	});

	if (isStoriesLanding) {
		breadcrumbService.setCurrentBreadcrumb('Stories');
	}
}
StoriesListController.$inject = ['$scope', 'StoryListFilter', 'CommunityBreadcrumbService', 'CommunityDataService', 'StoryDefaults', '$state'];

angular.module('community.stories')
	.controller('StoriesList', StoriesListController);


