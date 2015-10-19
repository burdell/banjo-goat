
'use strict';

require('services/api.js');
require('services/breadcrumb.js');
require('services/media.js');
require('services/nodestructure.js');
require('services/products.js');
require('services/currentuser.js');

require('directives/username/username.js');
require('directives/map/map.js');
require('directives/map/locationsearch.js');
require('directives/mediadisplay/video.js');
require('directives/mediadisplay/mediadisplay.js');
require('directives/texteditor/texteditor.js');



var _ = require('underscore');

function NewStoryController ($scope, $state, communityApi, breadcrumbService, mediaService, nodeServiceWrapper, productService, currentUserService, storyDefaults){
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

	productService.getProductList().then(function(productList){
		ctrl.productData = productList;
	});

	nodeServiceWrapper.get().then(function(nodeService){
		ctrl.story.nodeId = nodeService.CurrentNode.id;

		ctrl.getProductName = function(nodeId){
			var node = nodeService.getNode(nodeId);
			return node ? node.name : nodeId;
		}
	});

	_.extend(ctrl, {
		hideStoryControls: true,
		titleCharacterLimit: 140,
		subtitleWordLimit: 35,
		placeholders: {
			subject: 'Story Name',
			summary: 'Subtitle',
			coverPhotoUrl: storyDefaults.coverPhoto,
			body: '<div>Tell us your story!</div>',
			location: 'Project location',
			productsUsed: 'Products mentioned'
		},
		storyAuthor: currentUser,
		story: {
			nodeId: null,
			media: mediaList,
			summary: "",
			meta: {}
		},
		coordinates: {
			locLat: null,
			locLon: null,
			locDisplay: ''
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
	    productData: [],
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
			var story = _.extend(ctrl.discussion, ctrl.story, ctrl.coordinates, { productsUsed: ctrl.productList });
			communityApi.Stories.story(story).then(
				function(result){
					$state.go('stories.detail', { storyId: result.id });		
				},
				function(){
					ctrl.isPublishing = false;
				}
			);
		},		
		sortConfig: {
			handle: '.cmuStoriesNew__form--uploadItem--downup'
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


