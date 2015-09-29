(function(_){
	'use strict';
	
	function feedContent($compile, $templateCache) {

		var baseTemplateUrl = 'directory/feed/feedcontent/';
		var templateUrls = {
			features: baseTemplateUrl + 'feedfeature.html',
			announcements: baseTemplateUrl + 'feedannouncement.html',
			stories: baseTemplateUrl + 'feedstory.html',
			forums: baseTemplateUrl + 'feeddiscussion.html'
		}

		function getTemplate(contentType) {
			var templateUrl = templateUrls[contentType];
			return (templateUrl ? $templateCache.get(templateUrl) : '');
		}

		// var link = function(scope, element, attrs) {
		// 	var template = getTemplate(scope.feedcontent.contentModel.discussionStyle);
		// 	var templateElement = $(element).find('.feed-content-template');
		// 	templateElement.html(template);

		// 	$compile(element.contents())(scope);
		// };

		var controller = function(nodeServiceWrapper, dataService, routingService) {
			var ctrl = this;

			var discussionIcons = dataService.DiscussionTypeIcons;

			var contentType = ctrl.contentModel.type;
			var contentUser = contentType === 'topic' ? ctrl.contentModel.data.message.insertUser : ctrl.contentModel.data.insertUser;
			var urlId = contentType === 'topic' ? ctrl.contentModel.data.id : ctrl.contentModel.data.parentId;
			var contentNode = ctrl.contentModel.data.node;

			var commentText = function(){
				return contentUser.login + " replied to " + ctrl.contentModel.data.context.parentAuthor.login;
			};

			var contentUrl = function(routeString, dataOptions) {
				dataOptions = _.extend({ nodeId: contentNode.urlCode }, dataOptions);
				return routingService.generateUrl(routeString, dataOptions);
			}

			var discussionActionTexts = {
				features: {
					topic: function(contentData){
						return contentUser.login + " posted a feature request"; 
					},
					comment: function(contentData){
						return commentText();
					},
					url: function(){
						return contentUrl('features.detail', { featureRequestId: urlId });
					}
				},
				announcements: {
					topic: function(contentData){
						return contentUser.login + " posted an announcement"; 
					},
					comment: function(contentData){
						return contentUser.login + " replied to an announcement"; 
					},
					url: function(){
						return contentUrl('announcements.detail', { announcementId: urlId });
					}
				},
				stories: {
					topic: function(contentData){
						return contentUser.login + " posted a story"; 
					},
					comment: function(){
						return commentText();
					},
					url: function(){
						return contentUrl('stories.detail', { storyId: urlId });
					}	
				},
				forums: {
					topic: function(){
						return contentUser.login + " posted a topic"; 
					},
					comment: function(){
						return commentText();
					},
					url: function(){
						return contentUrl('forums.message', { messageId: urlId });
					}
				}
			}

			nodeServiceWrapper.get().then(function(nodeService){
				var node = nodeService.getNode(ctrl.contentData.nodeId || ctrl.contentData.node.id);
				ctrl.nodeName = node.description;
			});

			_.extend(ctrl, {
				getDiscussionIconClass: function(discussionType) {
					return discussionIcons[discussionType] || '';
				},
				contentData: ctrl.contentModel.data,
				getDiscussionActionString: function() {
					var model = ctrl.contentModel;
					return discussionActionTexts[model.discussionStyle][model.type]();
				},
				getPostDate: function(){
					if (contentType === 'topic') {
						return ctrl.contentModel.data.message.postDate
					} else if (contentType === 'comment') {
						return ctrl.contentModel.data.postDate;
					}
				},
				getContentUrl: function(){
					var model = ctrl.contentModel;
					return discussionActionTexts[model.discussionStyle].url()
				}
			});

		};
		controller.$inject = ['CommunityNodeService', 'CommunityDataService', 'CommunityRoutingService'];

	    var directive = {
	       // link: link,
	        controller: controller,
	        controllerAs: 'feedcontent',
	        templateUrl: baseTemplateUrl + 'feedcontent.html',
	        bindToController: true,
	        restrict: 'E',
	        replace: true,
	        scope: {
	        	contentModel: '='
	        }
	    };

	    return directive;
	}
	feedContent.$inject = ['$compile', '$templateCache']

	angular.module('community.directory')
		.directive('communityFeedContent', feedContent);
		
}(window._));
