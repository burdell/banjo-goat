
'use strict';

var _ = require('underscore');

function classToggle() {
	var link = function(scope, element, attrs) {
		var className = attrs.communityClassToggle;

		function hasClass() {
			return _.contains(element[0].classList, className);
		}

		element.on('click', function(){
			if (hasClass()) {
				this.classList.remove(className);
			} else {
				this.classList.add(className);
			}
		});

		scope.$on('$destroy', function(){
			element.unbind();
		});
	};

    var directive = {
        link: link,
        restrict: 'A'
    };
    return directive;
}

angular.module('community.directives')
	.directive('communityClassToggle', classToggle);
	