
'use strict';

require('directives/userbadge/userbadge.js');
require('directives/loadmore/loadmore.js');

var _ = require('underscore');

function communityCommentList() {
	
	function controller() {	
		var ctrl = this;
		_.extend(ctrl, {
			commentList: this.currentComments.content,
			getCommentCountText: function(){
				var contentLength = ctrl.currentComments.content.length;
				if (!contentLength) {
					return 'No comments';
				} else if (contentLength === 1) {
					return '1 comment';
				} else {
					return contentLength + ' comments';
				}
			}
		});
	}
	controller.$inject = [];
    
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
