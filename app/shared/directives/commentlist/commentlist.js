(function(_){
	'use strict';

	function communityCommentList() {
		function link(scope, element, attrs) {
		    
		}

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
	        link: link,
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
}(window._));