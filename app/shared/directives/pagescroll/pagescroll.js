
'use strict';
 
var _ = require('underscore');

function pageScroll() {
	var link = function(scope, element, attrs){
		element.on('click', function(){
			scope.pagescroll.scrollPage();
		});	
	};

	var controller = function($anchorScroll, $document) {
		var ctrl = this;
		_.extend(ctrl, {
			scrollTo: this.scrollTo || "#pageTop",
			text: this.scrollerText || "Back to Top",
			scrollPage: function(){
	            var top = 0;
	            var duration = 220; //milliseconds
	            $document.scrollTop(top, duration);
			}
		});
	};
	controller.$inject = ['$anchorScroll', '$document'];

    var directive = {
    	link: link,
        controller: controller,
        controllerAs: 'pagescroll',
        bindToController: true,
        restrict: 'A',
        scope: {
        	scrollerText: '@',
        	scrollTo: '@'
        }
    };

    return directive;
}

angular.module('community.directives')
	.directive('pageScroll', pageScroll);
	

