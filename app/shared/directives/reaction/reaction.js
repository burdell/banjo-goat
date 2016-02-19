
'use strict';
  
var _ = require('underscore');

require('services/localization.js')

function reaction() {
	var controller = function(apiService, localizationService, routingService) {
		var ctrl = this;
		
		_.extend(ctrl, {
			_messageId: ctrl.messageId ? ctrl.messageId : routingService.getCurrentId(),
			reactionDisplay: localizationService.data.core[ctrl.reactionType + 's'],
			react: function(){
				apiService.Reactions.react(ctrl._messageId, ctrl.reactionType).then(function(result){
					ctrl.reactionCount = result.message.scores[ctrl.reactionType + 'Count'];
				});
			}
		})
	};
	controller.$inject = [require('services/api.js'), 'CommunityLocalizationService', require('services/routing.js')];

    var directive = {
        controller: controller,
        controllerAs: 'reaction',
        templateUrl: 'directives/reaction/reaction.html',
        bindToController: true,
        restrict: 'E',
        scope: {
        	messageId: '=',
        	reactionCount: '=',
        	reactionType: '@',
        	thinDisplay: '='
        }
    };

    return directive;
}

angular.module('community.directives')
	.directive('communityReaction', reaction);
	

