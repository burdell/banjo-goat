
'use strict';

require('shared/services/data.js');
require('shared/services/routing.js');

require('shared/filters/timefromnow.js');
require('shared/filters/unformattext.js');
require('shared/filters/wordcut.js');


require('directives/productdiscussiontag/productdiscussiontag.js');

var _ = require('underscore');

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

	var controller = function(dataService, routingService) {
		var ctrl = this;

		var discussionIcons = dataService.DiscussionTypeIcons;
		var contentType = ctrl.contentModel.type;

		var contentUser = contentType === 'topic' ? ctrl.contentModel.data.message.insertUser : ctrl.contentModel.data.insertUser;
		var urlId = contentType === 'topic' ? ctrl.contentModel.data.id : ctrl.contentModel.data.topicId;
		var contentNode = contentType === 'topic' ? ctrl.contentModel.data.message.node : ctrl.contentModel.data.node;

		var commentText = function(){
			return contentUser.login + " replied to " + ctrl.contentModel.data.context.parentAuthor.login;
		};

		var contentUrl = function(routeString, dataOptions) {
			dataOptions = _.extend({ nodeId: contentNode.urlCode }, dataOptions);
			var hash = contentType === 'comment' ? ctrl.contentModel.data.id : null;
			return routingService.generateUrl(routeString, dataOptions, hash);
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
					// return contentUser.login + " posted an announcement"; 
					return " posted an announcement"; 
				},
				comment: function(contentData){
					return " replied to an announcement"; 
					return contentUser.login + " replied to an announcement"; 
				},
				url: function(){
					return contentUrl('announcements.detail', { announcementId: urlId });
				}
			},
			stories: {
				topic: function(contentData){
					// return contentUser.login + " posted a story"; 
					return " posted a story"; 
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
					// return contentUser.login + " posted a topic"; 
					return " posted a topic"; 
				},
				comment: function(){
					return commentText();
				},
				url: function(){
					return contentUrl('forums.message', { messageId: urlId });
				}
			}
		}

		var contentFns = {
			getDiscussionIconClass: function() {
				var discussionType = ctrl.contentModel.discussionStyle;
				return discussionIcons[discussionType] || '';
			},
			getDiscussionActionString: function() {
				var model = ctrl.contentModel;
				return discussionActionTexts[model.discussionStyle][model.type]();
			}, 
			getUser: function() {
				return contentUser;
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
		};

		var contentDisplay = {
			subject: contentType === 'topic' ? ctrl.contentModel.data.subject : ctrl.contentModel.data.context.topicSubject,
			body: contentType === 'topic' ? ctrl.contentModel.data.message.body : ctrl.contentModel.data.body,
			iconClass: contentFns.getDiscussionIconClass(),
			discussionActionString: contentFns.getDiscussionActionString(),
			getUser: contentFns.getUser(),
			postData: contentFns.getPostDate(),
			contentUrl: contentFns.getContentUrl(),
			nodeId: ctrl.contentModel.data.node.id
		};

		_.extend(ctrl, {
			contentDisplay: contentDisplay,
			isRead: function(){
				return !!ctrl.contentModel.context.lastReadDate; //returns true if lastreaddate exists
			}
		});
	};
	controller.$inject = ['CommunityDataService', 'CommunityRoutingService'];

    var directive = {
       // link: link,
        controller: controller,
        controllerAs: 'feedcontent',
        templateUrl: 'directives/feedcontent/feedcontent.html',
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
	

