(function(_){
	'use strict';

	function StoriesListController ($scope, storyFilter, breadcrumbService, dataService, storyDefaults, $state){
		var ctrl = this;
		var intitialList = storyFilter.initialData();

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
			}
		});

		if ($state.current.name === 'storiesLanding') {
			breadcrumbService.setCurrentBreadcrumb('Stories');
		}
	}
	StoriesListController.$inject = ['$scope', 'StoryListFilter', 'CommunityBreadcrumbService', 'CommunityDataService', 'StoryDefaults', '$state'];

	angular.module('community.stories')
		.controller('StoriesList', StoriesListController);

}(window._));
