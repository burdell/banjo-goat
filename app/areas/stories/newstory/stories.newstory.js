(function(_){
	'use strict';

	function NewStoryController ($scope, $state, communityApi, breadcrumbService, mediaService, nodeService, productService, currentUserService, storyDefaults){
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
			    "currentUserId": 259,
			    "categoryDisplayId": nodeService.CurrentNode.urlSlug,
			    "media": mediaList,
			    "summary": "",
			    "location": {
			        "display": "",
			        "coordinates": {
			            "lat": null,
			            "lng": null
			        }
			    }
			},
			discussion: {
			    "subject": "",
			    "body": ""
		    },
		    productList: [],
		    productData: productService.getProductList(),
			addPhoto: _.bind(function(result){
				var fileData = result;
				var imageObj = {
					url: fileData.fileUrl,
					type: 'image'
				};

				if (mediaList.length === 0) {
					ctrl.setCoverPhoto(imageObj);
				}
				updateMediaList(imageObj);
			}, ctrl),
			deletePhoto: function(photoIndex) {
				var removedItem = mediaList.splice(photoIndex, 1);

				if (ctrl.cover && (removedItem[0].$$hashKey === ctrl.cover.$$hashKey)) {
					ctrl.removeCoverPhoto()
				}
			},
			setCoverPhoto: function(imageObj){
				if (ctrl.cover) {
					ctrl.cover.meta.isCover.value = false;
				}

				if (!imageObj.meta) {
					imageObj.meta = {};
				}
				if (!imageObj.meta.isCover) {
					imageObj.meta.isCover = {
						key: 'isCover'
					};
				}

				imageObj.meta.isCover.value = true;
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
				console.log(story);
				communityApi.Stories.story(story).then(
					function(result){
						$state.go('stories.detail', { storyId: result.model.id });		
					},
					function(){
						ctrl.isPublishing = false;
					}
				);
			},			
			sortConfig: {
				handle: '.ubnt-icon--arrows-downup'
			}
		});
	}
	NewStoryController.$inject = [
		'$scope', 
		'$state',
		'CommunityApiService',
		'CommunityBreadcrumbService', 
		'CommunityMediaService',
		'CommunityNodeService', 
		'CommunityProductService',
		'CurrentUserService', 
		'StoryDefaults'
	];

	angular.module('community.stories')
		.controller('NewStory', NewStoryController);

}(window._));
