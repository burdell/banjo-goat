(function(_){
	'use strict';

	function NewStoryController ($scope, breadcrumbService, productService, currentUserService){
		breadcrumbService.setCurrentBreadcrumb('Tell Your Story');

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		var ctrl = this;

		_.extend(ctrl, {
			titleCharacterLimit: 140,
			subtitleWordLimit: 35,
			productList: productService.getProductList(),
			placeholders: {
				subject: 'Story Title',
				summary: 'Subtitle',
				coverPhotoUrl: "http://thecatapi.com/api/images/get?format=src",
				body: 'Project description will go here. Talk about any challenges and how you overcame the obstacles.',
				location: 'Project Location',
				productsUsed: 'List products used in your project'
			},
			story: {
				author: currentUserService.get()
			},
			titleCharactersLeft: function() {
				var limit = ctrl.titleCharacterLimit;
				var subject = ctrl.story.subject;
				return  subject ? limit - subject.length : limit; 
			},
			subtitleWordsLeft: function(){
				var limit = ctrl.subtitleWordLimit;
				var subtitle = ctrl.story.summary;
				return subtitle ? limit - subtitle.split(' ').length : limit; 

			}
		});
	}
	NewStoryController.$inject = ['$scope', 'CommunityBreadcrumbService', 'CommunityProductService', 'CurrentUserService'];

	angular.module('community.stories')
		.controller('NewStory', NewStoryController);

}(window._));
