
'use strict';

require('services/nodestructure.js');
require('services/routing.js');

require('directives/arealinkhandler/arealinkhandler.js');

var _ = require('underscore');


function productDiscussionTag() {
	
	var controller = function(nodeServiceWrapper, routingService) {
        var ctrl = this;
        nodeServiceWrapper.get().then(function(nodeService){
            var node = nodeService.getNode(ctrl.nodeId);
            _.extend(ctrl, {
                nodeName: node.description,
                nodeUrl: routingService.generateUrl(node.discussionStyle + '.list', { nodeId: node.urlCode })
            });
        });
	};
	controller.$inject = ['CommunityNodeService', 'CommunityRoutingService'];

    var directive = {
        controller: controller,
        controllerAs: 'productdiscussiontag',
        templateUrl: 'directives/productdiscussiontag/productdiscussiontag.html',
        bindToController: true,
        restrict: 'E',
        replace: true,
        scope: {
            nodeId: '='
        }
    };

    return directive;
}

angular.module('community.directives')
	.directive('productDiscussionTag', productDiscussionTag);
	

