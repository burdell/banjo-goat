
'use strict';

require('directives/userbadge/userbadge.js');
require('directives/loadmore/loadmore.js');


var _ = require('underscore');

function communityCommentList() {
	
	function controller(localizationService) {	
		var ctrl = this;

		var strings = localizationService.data.directives.commentlist;
		
		_.extend(ctrl, {
			commentList: this.currentComments,
			getCommentCountText: function(){
				var contentLength = ctrl.currentComments.content.length;
				if (!contentLength) {
					return strings.noComments;
				} else if (contentLength === 1) {
					return '1 ' + strings.comment;
				} else {
					return contentLength + ' ' + strings.comments;
				}
			}
		});
	}
	controller.$inject = ['CommunityLocalizationService'];
    
    var directive = {
        controller: controller,
        templateUrl: 'directives/commentlist/commentlist.html',
        restrict: 'E',
        controllerAs: 'commentlist',
        bindToController: true,
        replace: true,
        scope: {
        	currentComments: '=',
        	commentData: '=commentMetadata',
        	commentFilter: '='
        }
    };

    return directive;
}

angular.module('community.directives')
	.directive('communityCommentList', communityCommentList);
