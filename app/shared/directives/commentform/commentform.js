
'use strict';

require('directives/texteditor/texteditor.js');

var _ = require('underscore');

function commentForm() {
	var controller = function(communityApi, localizationService) {
		var ctrl = this;	

		var strings = localizationService.data.directives.commentform;

		var parentMessage = ctrl.parentMessage;
		var formComment = ctrl.formComment ||  {
			body: null,
			nodeId: parentMessage.node.id,
			parentId: parentMessage.id,
			topicId: parentMessage.topicId || parentMessage.id
		};		
	
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
			comment: formComment,
			replyButtonText: ctrl.replyButtonText || strings.postComment
		});
	};
	controller.$inject = [require('services/api.js'), 'CommunityLocalizationService'];

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
        	autofocus: '@',
        	fixedtobottom: '@',
        	formComment: '='
        }
    };
    return directive;
}

angular.module('community.directives')
	.directive('communityCommentForm', commentForm);
	
