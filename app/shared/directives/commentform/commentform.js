
'use strict';

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
					communityApi.Messages.message(ctrl.comment).then(function(result){
						ctrl.submittingComment = false;

						if (ctrl.commentList) {
							ctrl.commentList.content.push(result);
						}
						
						ctrl.comment.body = null;
						ctrl.cancelReply();

						if (ctrl.onSuccessFn) {
							ctrl.onSuccessFn(result);
						}
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
				topicId: parentMessage.topicId || parentMessage.id
			},
			replyButtonText: ctrl.replyButtonText || 'Submit Comment'
		});
	};
	controller.$inject = [require('services/api.js')];

    var directive = {
        controller: controller,
        templateUrl: 'directives/commentform/commentform.html',
        controllerAs: 'commentform',
        bindToController: true,
        restrict: 'E',
        scope: {
        	headerTitle: '@',
        	toggleAttribute: '=',
        	parentMessage: '=',
        	commentList: '=',
        	replyButtonText: '@',
        	replyingButtonText: '@',
        	minimalEditor: "=",
        	onSuccessFn: '=',
        	topicId: '=',
        	autofocus: '='
        }
    };
    return directive;
}

angular.module('community.directives')
	.directive('communityCommentForm', commentForm);
	
