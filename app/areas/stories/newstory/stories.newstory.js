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
/*
There’s a reason that photos get 53% more likes on Facebook than any other type of post.  People love to see your adventures.  Go ahead and make them envious by adding your favorite pictures to every travel story you write.
Not sure which photos to add? Pick the ones that show you in action or include an incredible view
Don’t be afraid of details.
Post screenshots and details. We love that stuff
Narrative reels us in.
Everyone loves a good story. Try your hand at being a National Geographic reporter and tell us something interesting that happened to you. Use action verbs, lots of adjectives and let your personality shine through your work.
Often, the best travel stories are how you resolved an issue, language barriers or miscommunications with reservations. Try to stay away from blaming and negativity. Stick to fun, funny stuff that describes your emotions.
*/

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
