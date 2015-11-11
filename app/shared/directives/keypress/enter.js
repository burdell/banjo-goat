
'use strict';

function enter() {
    var link = function(scope, element, attrs){
        element.bind('keydown', function(event){
            if (event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.communityEnter, { 'event': event });
                });
            }
        });
    };

    var directive = {
        link: link,
        restrict: 'A',
    };
    return directive;
}

angular.module('community.directives')
	.directive('communityEnter', enter);
	
