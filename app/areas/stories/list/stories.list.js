(function(_){
	'use strict';

	function StoriesListController (storyFilter, dataService, $state){
		var ctrl = this;

		var intitialList = storyFilter.initialData();

		_.extend(ctrl, {
			storyFilter: storyFilter,
			storyList: intitialList.collection,
			storyMetadata: intitialList.next,
			sortOptions: dataService.MessageSort,
			createStory: function(){
				$state.go('stories.new');
			}
		});
	}
	StoriesListController.$inject = ['StoryListFilter', 'CommunityDataService', '$state'];

	angular.module('community.stories')
		.controller('StoriesList', StoriesListController);

}(window._));
