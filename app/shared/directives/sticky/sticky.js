
'use strict';

var _ = require('underscore');


// optional args:
// yOffset - extra offset from the top
// container - #id of the container to trap the sticky div; sticky ends when bottom of sticky hits the container's inside bottom (within padding and margin)
// containerOffset - additional offset from the bottom of the container


function sticky($document, $window) {
	var link = function(scope, element, attrs) {

		var stickyClass = attrs.stickyClass; // class that makes things sticky
		var offset = parseFloat(attrs.offset);

		// the container element
		// needs to stay position: relative, with a manually set height
		var container = element[0];
	    var angularElem = angular.element(element);
	    // var containerHeight = container.offsetHeight;
	    // var windowHeight = $window.innerHeight;

	    // the target within the container
	    // fixed / floating element
	    var target = angularElem.children()[0];
	    var angularTarget = angular.element(target);
	    var targetHeight;


	    // heights / distances must be loaded on scroll, since elements will be populated by then
	    $document.on('scroll', function() {
	    	// offset value accounds for the fixed menu height
	    	var menuHeight = 40;
	    	targetHeight = target.clientHeight;

		    var box = container.getBoundingClientRect();
	    	// var top = box.top + window.pageYOffset - document.documentElement.clientTop; // might change when things update
	    	
	    	// distance to pos:relative top
	    	var targetTop = (target.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop);
	    	var targetTopRelative = targetTop - top;

	    	// distance from container to top of viewport
		    var containerDistToViewportTop = box.top - menuHeight - offset;
		    var containerDistToPageTop = containerDistToViewportTop + window.pageYOffset

			var targetDistToTop = menuHeight;
			var targetWidth = container.offsetWidth;
			if (offset > 0) {
				targetDistToTop += offset;
			}

		    // console.log('elemBottom: ' + parseFloat(elemHeight+) + 'elemH: ' + elemHeight + ' windowH: ' + windowHeight);
	    	if (containerDistToViewportTop < 0) {
				if (!isStuck()) {
					// angularElem.html(angularElem.html() + angularElem.html());
					// container.outerHTML += copy[0].outerHTML;

					// replace with a dummy height so elements don't jolt
					angularElem.css("height", container.offsetHeight + 'px');
					angularTarget.addClass(stickyClass);

					// console.log('tHeight: ' + targetDistToTop)
					angularTarget.css("top", targetDistToTop + 'px');
					angularTarget.css("width", targetWidth + 'px');
				}


			    // optional bounding container
				var bound = document.getElementsByClassName(attrs.stickyBound)[0];
			    if (typeof(bound) != "undefined") {

				    var angularBound = angular.element(bound);
				    var boundToBottomDist, boundDistToTop, boundHeight, boundBottomDistToTop, boundPadding;
					boundDistToTop = bound.getBoundingClientRect().top;
		    	    boundHeight = bound.clientHeight;
		    	    boundPadding = parseInt(window.getComputedStyle(bound).paddingBottom, 10) + parseInt(window.getComputedStyle(bound).paddingTop, 10);
		    	    // angularBound.css('padding-bottom', '123px');
		    		// console.log('boundElem_paddbott: ' + document.getElementsByClassName(attrs.stickyBound)[0])
		    		
		    	    boundBottomDistToTop = boundDistToTop + boundHeight - boundPadding;
		    	    var boundContentHeight = boundBottomDistToTop + window.pageYOffset;
		    	    // boundBottom = parseFloat(bound.clientTop+bound.clientHeight); // client keeps it within border
		    	    // console.log(' eeee ' + parseFloat(boundContentHeight - targetHeight - containerDistToPageTop))
		    	    var targetBoundPosition = parseFloat(boundContentHeight - targetHeight - containerDistToPageTop);

		    		// console.log('boundBottomDistToTop: ' + boundBottomDistToTop + ' boundHeight: ' + boundHeight + ' targetHEight: ' + targetHeight)
		    	    // boundBottomDistToTop = 
		    	    // console.log('boundHeight: ' + parseFloat(bound.clientHeight));
		    	    // console.log(bound)
		    	    boundToBottomDist = boundBottomDistToTop - targetHeight;



				    // console.log('bound:')
				    // console.log(angularBound);

			    	if (boundToBottomDist < 0 ) {
			    	    
		    	    	// console.log('boxtop: '+ box.top)
		    	    	// console.log('hit bottom ' + parseInt(target.getBoundingClientRect().top + window.scrollY - box.top));
		    	    	// console.log(angularBound)

						angularTarget.css("top", targetBoundPosition + 'px');
						angularTarget.addClass("cmuStuck--bottom");
		    	    } 
		    	    else {
		    	    	// reset
		    	    	// console.log('within again: ' + targetDistToTop)
						angularTarget.css("top", targetDistToTop + 'px');
						angularTarget.removeClass("cmuStuck--bottom");
		    	    }
		    	}


	    	} else {
	    		if (isStuck()) {
					angularElem.css("height");
					angularTarget.removeClass(stickyClass);
				}
			}
	    });

		function isStuck() {
			return angularTarget.hasClass(stickyClass);
		}

		scope.$on('$destroy', function(){
			element.unbind();
		});
	};

    var directive = {
        link: link,
        restrict: 'A'
    };
    return directive;
};

sticky.$inject = [
	'$document',
	'$window'
];

angular.module('community.directives')
	.directive('communitySticky', sticky);
	