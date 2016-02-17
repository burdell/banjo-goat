
'use strict';
 
var _ = require('underscore');

function pageScroll() {
	var link = function(scope, element, attrs){
		element.on('click', function(){
			console.log('pagescroll click')
			scope.pagescroll.scrollPage();
		});	
	};

	var controller = function($anchorScroll, $document) {
		var ctrl = this;
		_.extend(ctrl, {
			scrollTo: this.scrollTo || "#pageTop",
			text: this.scrollerText || "Back to Top",
			scrollPage: function(){
				// $anchorScroll(this.scrollTo);

	            var top = 0;
	            var duration = 100; //milliseconds
	            console.log($document)
	            //Scroll to the exact position
	            $document.scrollTop(top, duration).then(function() {
	              console && console.log('You just scrolled to the top!');
	            });
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
	

