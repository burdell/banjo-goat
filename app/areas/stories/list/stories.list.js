(function(_){
	'use strict';

	function StoriesListController (storyFilter, dataService, storyDefaults, $state){
		var ctrl = this;

		var intitialList = storyFilter.initialData();
		var storiesPerRow = 4;

		var groupStoryData = function(storyData){
			var groupedData = [];

			var i, j;
			for (i=0,j=storyData.length; i<j; i+=storiesPerRow) {
				groupedData.push(storyData.slice(i,i+storiesPerRow));
			}

			return groupedData;
		};


		_.extend(ctrl, {
			storyFilter: storyFilter,
			storyList: intitialList.collection,
			groupedStoryList: groupStoryData(intitialList.collection),
			storyMetadata: intitialList.next,
			sortOptions: dataService.MessageSort,
			createStory: function(){
				$state.go('stories.new');
			},
			defaultPhoto: storyDefaults.coverPhoto,
			groupStoryData: function(storyData){
				ctrl.groupedStoryList = groupStoryData(storyData);
			}
		});
	}
	StoriesListController.$inject = ['StoryListFilter', 'CommunityDataService', 'StoryDefaults', '$state'];

	angular.module('community.stories')
		.controller('StoriesList', StoriesListController);

}(window._));
