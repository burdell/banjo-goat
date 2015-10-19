
'use strict';

var _ = require('underscore');

require('filters/timefromnow.js');
require('filters/extractkey.js');

function storyDisplay() {
	var link = function(scope, element, attrs) {
	};

	var controller = function() {
		var ctrl = this;
		
		var media = _.find(ctrl.storyMedia, function(mediaObject){ 
			return mediaObject.meta && mediaObject.meta.isCover; 
		});
	
		if (media) {
			ctrl.coverphoto = media.url;
		}
	};
	controller.$inject = [];

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
        	storyMedia: '=',
        	defaultPhotoUrl: '=',
        	fillWidth: '='
        }
    };

    return directive;
}

angular.module('community.directives')
	.directive('storyDisplay', storyDisplay);
	