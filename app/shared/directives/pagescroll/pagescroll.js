
'use strict';
 
var _ = require('underscore');

function pageScroll() {
	var link = function(scope, element, attrs){
		element.on('click', function(){
			console.log('pagescroll click')
			scope.pagescroll.scrollPage();
		});	
	};

	var controller = function($anchorScroll) {
		var ctrl = this;
		_.extend(ctrl, {
			scrollTo: this.scrollTo || "#pageTop",
			text: this.scrollerText || "Back to Top",
			scrollPage: function(){
				$anchorScroll(this.scrollTo);
			}
		});
	};
	controller.$inject = ['$anchorScroll'];

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
	

