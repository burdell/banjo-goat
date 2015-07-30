(function(_){
	'use strict';

	function StoriesListController ($scope, storyFilter, dataService, storyDefaults, $state){
		var ctrl = this;
		var intitialList = storyFilter.initialData();
		
		_.extend(ctrl, {
			storyFilter: storyFilter,
			storyList: intitialList.collection,
			storyMetadata: intitialList.next,
			sortOptions: dataService.MessageSort,
			createStory: function(){
				$state.go('stories.new');
			},
			defaultPhoto: storyDefaults.coverPhoto,
			groupStoryData: function(newData){
				_.each(newData, function(story) {
					ctrl.storyList.push(story);
				});

				$scope.$broadcast('communityGridList:redraw');
			}
		});
	}
	StoriesListController.$inject = ['$scope', 'StoryListFilter', 'CommunityDataService', 'StoryDefaults', '$state'];

	angular.module('community.stories')
		.controller('StoriesList', StoriesListController);

}(window._));
