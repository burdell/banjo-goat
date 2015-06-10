(function(_){
	'use strict';

	function StoriesListController (storyFilter){
		var ctrl = this;

		var intitialList = storyFilter.initialData();

		_.extend(ctrl, {
			storyFilter: storyFilter,
			storyList: intitialList.collection,
			storyMetadata: intitialList.next
		});
	}
	StoriesListController.$inject = ['StoryListFilter'];

	angular.module('community.stories')
		.controller('StoriesList', StoriesListController);

}(window._));
