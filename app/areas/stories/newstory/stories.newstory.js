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
			if (data.type === 'image' && mediaList.length === 0) {
				ctrl.setCoverPhoto(data);
			}
			
			mediaList.push(data);
		};

		var currentUser = currentUserService.get().then(function(userData){
			ctrl.currentUserLogin = userData.user.login;
		});
		
		_.extend(ctrl, {
			hideStoryControls: true,
			titleCharacterLimit: 140,
			subtitleWordLimit: 35,
			placeholders: {
				subject: 'Story title',
				summary: 'Subtitle',
				coverPhotoUrl: storyDefaults.coverPhoto,
				body: '<div>Your story will appear here.</div>\
				Tips to writing a great story:\
					<ol>\
						<li><strong>Great titles grabs attention</strong>\
							<ul>\
								<li>Use short, engaging, inspiring, titles</li>\
								<li><em>Ex: "How mFi saved me another HUGE mess on the farm."</em></li>\
								<li><em>Ex: "The shed caught on fire... and the airFiber still works."</em></li>\
							</ul>\
						</li>\
						<li><strong>Add photos!</strong>\
							<ul>\
								<li>Beautiful, inspiring, or interesting images get more viewers</li>\
								<li>Photos of equipment, environments and screenshots help illustrate the story</li>\
								<li>Set your best image as the cover photo</li>\
							</ul>\
						</li>\
						<li><strong>Everyone loves a good story</strong>\
							<ul>\
								<li>Give us some details: What did you see? What did you set out to do? What were some challenges? </li>\
								<li>How did you resolve your issues, or overcome your obstacles? What was your solution?</li>\
								<li>What did you learn?</li>\
							</ul>\
						</li>\
					</ol>\
					',
				location: 'Project location',
				productsUsed: 'Products mentioned'
			},
			storyAuthor: currentUser,
			story: {
			    "categoryDisplayId": nodeService.CurrentNode.urlSlug,
			    "media": mediaList,
			    "summary": "",
			    "location": {
			        "display": "",
			        "coordinates": {
			            "lat": null,
			            "lng": null
			        }
			    },
			    meta: {}
			},
			setMetaField: function(fieldName){
				var metaStoryFields = ctrl.story.meta;
				if (!metaStoryFields[fieldName]) {
					metaStoryFields[fieldName] = {
						key: fieldName,
						value: null
					};
				}

				metaStoryFields[fieldName].value = ctrl.metaValues[fieldName];
			},
			metaValues: {

			},
			discussion: {
			    "subject": "",
			    "body": ""
		    },
		    productData: productService.getProductList(),
			addPhoto: _.bind(function(result){
				var fileData = result;
				var imageObj = {
					url: fileData.fileUrl,
					type: 'image'
				};

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
				handle: '.cmuStoriesNew__Form--uploadItem--downup'
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
