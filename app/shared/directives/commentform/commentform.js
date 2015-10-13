
'use strict';

require('services/api.js');
require('directives/texteditor/texteditor.js');

var _ = require('underscore');

function commentForm() {
	var controller = function(communityApi) {
		var ctrl = this;

		var parentMessage = ctrl.parentMessage;
		_.extend(ctrl, {
			showReply: function(){
				ctrl.replyInProgress = true;
			},
			cancelReply: function(){
				ctrl.toggleAttribute = false;
			},
			submitReply: function(){
				if (ctrl.comment.body) {
					ctrl.submittingComment = true;
					communityApi.Core.message(ctrl.comment).then(function(result){
						ctrl.submittingComment = false;

						ctrl.commentList.content.unshift(result);
						
						ctrl.comment.body = null;
						ctrl.cancelReply();
					},
					function(){
						ctrl.submittingComment = false;
					});
				}
			},
			comment: {
				body: null,
				nodeId: parentMessage.node.id,
				parentId: parentMessage.id,
				topicId: parentMessage.id
			}
		});
	};
	controller.$inject = ['CommunityApiService'];

    var directive = {
        controller: controller,
        templateUrl: 'directives/commentform/commentform.html',
        controllerAs: 'commentform',
        bindToController: true,
        restrict: 'E',
        scope: {
        	toggleAttribute: '=',
        	parentMessage: '=',
        	commentList: '='
        }
    };
    return directive;
}

angular.module('community.directives')
	.directive('communityCommentForm', commentForm);
	
