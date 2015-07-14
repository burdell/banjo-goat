(function(_){
	'use strict';

	function NewStoryController ($scope, communityApi, breadcrumbService, mediaService, productService, currentUserService, storyDefaults){
		breadcrumbService.setCurrentBreadcrumb('Tell Your Story');

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});

		var ctrl = this;

		var mediaList = [];
		var updateMediaList = function(data){
			mediaList.push(data);
		};

		var currentUser = currentUserService.get();

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
			storyAuthor: currentUser,
			story: {
				currentUserId: currentUser.id,
				media: mediaList
			},
			discussion: {
			    "subject": "",
			    "body": ""
		    },
		    productList: [],
		    productData: productService.getProductList(),
			addPhoto: _.bind(function(result){
				var fileData = result;
				updateMediaList({
					url: fileData.fileUrl,
					type: 'image'
				});
			}, ctrl),
			deletePhoto: function(photoIndex) {
				var removedItem = mediaList.splice(photoIndex, 1);

				if (ctrl.cover && (removedItem[0].$$hashKey === ctrl.cover.$$hashKey)) {
					ctrl.removeCoverPhoto()
				}
			},
			setCoverPhoto: function(imageObj){
				if (ctrl.cover) {
					ctrl.cover.meta.isCover = false;
				}

				if (!imageObj.meta) {
					imageObj.meta = {};
				}
				imageObj.meta.isCover = true;

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
				ctrl.isPublishing = true;

				var story = _.extend(ctrl.discussion, ctrl.story, { productsUsed: ctrl.productList });
				communityApi.Stories.story(story).then(
					function(result){
						
					},
					function(){
						ctrl.isPublishing = false;
					});
			},			
			sortConfig: {
				handle: '.ubnt-icon--arrows-downup'
			}
		});
	}
	NewStoryController.$inject = [
		'$scope', 
		'CommunityApiService',
		'CommunityBreadcrumbService', 
		'CommunityMediaService', 
		'CommunityProductService', 
		'CurrentUserService', 
		'StoryDefaults'
	];

	angular.module('community.stories')
		.controller('NewStory', NewStoryController);

}(window._));
