
'use strict';

var _ = require('underscore');

function subscribe() {
	function controller(communityApi, nodeServiceWrapper,  routingService) {	
		var ctrl = this;


		var subscriptionModel = null;
		nodeServiceWrapper.get().then(function(nodeService){
			subscriptionModel = {
				topicId: Number(routingService.getCurrentId()),
				nodeId: nodeService.CurrentNode.id
			}
		});

		_.extend(ctrl, {
			subscribe: function(){
				communityApi.Subscriptions.add(subscriptionModel).then(function(result){
					ctrl.isSubscribed = true;
				});
			},
			isSubscribed: false
		})
	}
	controller.$inject = [require('services/api.js'), require('services/nodestructure.js'), require('services/routing.js')];
    
    var directive = {
        controller: controller,
        templateUrl: 'directives/subscribe/subscribe.html',
        restrict: 'E ',
        controllerAs: 'subscribe',
        bindToController: true,
        replace: true,
        scope: {
        }
    };

    return directive;
}
subscribe.$inject = [];

angular.module('community.directives')
	.directive('communitySubscribe', subscribe);
