
'use strict';
 
var _ = require('underscore');

function pageScroll() {
	
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
        controller: controller,
        controllerAs: 'pagescroll',
        templateUrl: 'directives/pagescroll/pagescroll.html',
        bindToController: true,
        restrict: 'E',
        scope: {
        	scrollerText: '@',
        	scrollTo: '@'
        }
    };

    return directive;
}

angular.module('community.directives')
	.directive('pageScroll', pageScroll);
	

