
'use strict';

require('services/loader.js');

var _ = require('underscore');
var $ = require('jquery');

function loader() {
     var link = function(scope, element, attrs){
        if (!scope.loader.baseLoader) {
            var attributeSelector = scope.loader.hideElementSelector || 'div[ui-view="mainContent"]';

            scope.loader.showElement = function(){
                $(attributeSelector).show();
            };

            scope.loader.hideElement = function(){
                $(attributeSelector).hide();
            };
        }
    };


	var controller = function($scope, loaderService) {
		var ctrl = this;
        var showLoader = false;
        if (!ctrl.baseLoader) {
            $scope.$on('$stateChangeStart', function(){
                ctrl.hideElement();
                showLoader = true;
            })

            $scope.$on('$stateChangeSuccess', function(){
                ctrl.showElement();
                showLoader = false;
            });
        } 

		_.extend(ctrl, {
            showLoader: function(){
                if (ctrl.baseLoader) {
                    return loaderService.showBaseLoader;
                } else {
                    return showLoader;
                }
            }
		});
	};
	controller.$inject = ['$scope', 'CommunityLoaderService'];

    var directive = {
        link: link,
        controller: controller,
        templateUrl: 'directives/loader/loader.html',
        controllerAs: 'loader',
        bindToController: true,
        restrict: 'E',
        replace: true,
        scope: {
        	showWhen: '=',
            baseLoader: '=',
            hideElementSelector: '@'
        }
    };
    return directive;
}

angular.module('community.directives')
	.directive('communityLoader', loader);
	
