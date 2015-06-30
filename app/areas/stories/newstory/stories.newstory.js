(function(_){
	'use strict';

	function NewStoryController ($scope, breadcrumbService, mediaService, productService, currentUserService, storyDefaults){
		breadcrumbService.setCurrentBreadcrumb('Tell Your Story');

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		var ctrl = this;

		var mediaList = [];
		var updateMediaList = function(data){
			data.sortOrder = mediaList.length;
			mediaList.push(data);
		};

		_.extend(ctrl, {
			hideStoryControls: true,
			titleCharacterLimit: 140,
			subtitleWordLimit: 35,
			productList: productService.getProductList(),
			placeholders: {
				subject: 'Story Title',
				summary: 'Subtitle',
				coverPhotoUrl: storyDefaults.coverPhoto,
				body: 'Project description will go here. Talk about any challenges and how you overcame the obstacles.',
				location: 'Project Location',
				productsUsed: 'List products used in your project'
			},
			story: {
				author: currentUserService.get(),
				mediaList: mediaList
			},
			addPhoto: _.bind(function(result){
				var fileData = result;
				updateMediaList({
					type: 'image',
					imageUrl: fileData.fileUrl
				});
			}, ctrl),
			deletePhoto: function(photoIndex) {
				var removedItem = ctrl.story.mediaList.splice(photoIndex, 1);

				if (ctrl.cover && (removedItem[0].$$hashKey === ctrl.cover.$$hashKey)) {
					ctrl.removeCoverPhoto()
				}
			},
			setCoverPhoto: function(imageObj){
				if (ctrl.cover) {
					ctrl.cover.isCover = false;
				}

				imageObj.isCover = true;

				ctrl.cover = imageObj;
			},
			removeCoverPhoto: function(){
				ctrl.cover = null;	
			},
			notCoverPhoto: function(imageObj) {
				return !(ctrl.cover && (ctrl.cover === imageObj));
			},
			addNewMedia: function(newMediaUrl){
				mediaService.getMediaType(newMediaUrl).then(function(result){
					updateMediaList(result);
					ctrl.newMediaUrl = null;
				});
			},
			postStory: function(){
				console.log(ctrl.story);
			},			
			sortConfig: {
				onUpdate: function(event) {
					_.each(event.models, function(mediaModel, index) {
						mediaModel.sortOrder = index;
					});
				},
				handle: '.ubnt-icon--arrows-downup'
			}
		});
	}
	NewStoryController.$inject = ['$scope', 'CommunityBreadcrumbService', 'CommunityMediaService', 'CommunityProductService', 'CurrentUserService', 'StoryDefaults'];

	angular.module('community.stories')
		.controller('NewStory', NewStoryController);

}(window._));
