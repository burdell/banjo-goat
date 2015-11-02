
'use strict';

var _ = require('underscore');

function communityProductNavigator() {
	var link = function(scope, element, attrs) {
	};

	var controller = function($scope, nodeServiceWrapper, routingService) {
		var ctrl = this;

        nodeServiceWrapper.get().then(function(nodeService){
            var categoryList = nodeService.DiscussionTypes;

            var productCategories = {};
            _.each(categoryList, function(children, category){
                productCategories[category] = _.filter(children, function(child){
                    return !ctrl.discussionStyle || (child.discussionStyles && child.discussionStyles[ctrl.discussionStyle]);
                });
            });
            ctrl.templateData.productCategories = productCategories;
        });

		_.extend(ctrl, {
			buttonDisplayText: ctrl.displayText || 'Select Product',
            toggleMenu: function(){
                $scope.$broadcast('megamenu:toggleProductNavigator');
            }, 
            templateData: {
                getProductUrl: function(productNode) {
                    var nodeUrlCode = ctrl.discussionStyle ? routingService.generateDiscussionUrl(productNode.urlCode, ctrl.discussionStyle) : productNode.urlCode;
                    return routingService.generateUrl(ctrl.productRoute, { nodeId: nodeUrlCode });
                }
            }
		});
	};
	controller.$inject = ['$scope', require('services/nodestructure.js'), require('services/routing.js')];

    var directive = {
        link: link,
        controller: controller,
        templateUrl: 'directives/productnavigator/productnavigator.html',
        controllerAs: 'productnavigator',
        bindToController: true,
        restrict: 'E',
        scope: {
            discussionStyle: '@',
        	displayText: '@',
            productDiscussionStyle: '@',
            productRoute: '@'
        }
    };
    return directive;
}

angular.module('community.directives')
	.directive('communityProductNavigator', communityProductNavigator);
	
