(function(_){
	'use strict';

	function StoriesListController (storiesFilter){
		var ctrl = this;

		function setStoryData (result){
			ctrl.storyList = result.collection;
			ctrl.storyCount = result.next.total;
		}
		storiesFilter.set({ onFilter: setStoryData });

		_.extend(ctrl, {

		});
	}
	StoriesListController.$inject = ['StoryListFilter'];

	angular.module('community.stories')
		.controller('StoriesList', StoriesListController);

}(window._));
