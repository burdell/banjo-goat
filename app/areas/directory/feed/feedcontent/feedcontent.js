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

		var link = function(scope, element, attrs) {
			var template = getTemplate(scope.feedcontent.contentModel.discussionStyle);
			var templateElement = $(element).find('.feed-content-template');
			templateElement.html(template);

			$compile(element.contents())(scope);
		};

		var controller = function(nodeServiceWrapper, dataService) {
			var ctrl = this;

			var discussionIcons = dataService.DiscussionTypeIcons;

			nodeServiceWrapper.get().then(function(nodeService){
				var node = nodeService.getNode(ctrl.contentData.nodeId || ctrl.contentData.node.id);
				ctrl.nodeName = node.description;
			});

			_.extend(ctrl, {
				getDiscussionIconClass: function(discussionType) {
					return discussionIcons[discussionType] || '';
				},
				contentData: ctrl.contentModel.data,
			});

		};
		controller.$inject = ['CommunityNodeService', 'CommunityDataService'];

	    var directive = {
	        link: link,
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
