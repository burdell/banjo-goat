
'use strict';

var _ = require('underscore');

require('filters/timefromnow.js');
require('filters/extractkey.js');

require('providers/defaults.js');

require('services/routing.js');

require('directives/arealinkhandler/arealinkhandler.js');
require('directives/productdiscussiontag/productdiscussiontag.js');

function storyDisplay() {
	var link = function(scope, element, attrs) {
	};

	var controller = function(routingService, defaults) {
		var ctrl = this;

		ctrl.storyMedia = ctrl.story.media;
		var media = _.find(ctrl.storyMedia, function(mediaObject){ 
			return mediaObject.meta && mediaObject.meta.isCover; 
		});

		
		ctrl.coverphoto = media ? media.url : defaults.noPhoto;
		

		_.extend(ctrl, {
			getStoryUrl: function(){
				return routingService.generateUrl('stories.detail', { nodeId: ctrl.story.node.urlCode, storyId: ctrl.story.id });
			},
			nodeId: ctrl.story.node.id
		});
	};
	controller.$inject = ['CommunityRoutingService', 'communityDefaults'];

    var directive = {
        link: link,
        controller: controller,
        templateUrl: 'directives/storydisplay/storydisplay.html',
        controllerAs: 'storydisplay',
        bindToController: true,
        replace: true,
        restrict: 'E',
        scope: {
        	story: '=',
        	defaultPhotoUrl: '=',
        	fillWidth: '=',
        	minimalDisplay: '=',
        	hidePostingInfo: '='
        }
    };

    return directive;
}

angular.module('community.directives')
	.directive('storyDisplay', storyDisplay);
	
