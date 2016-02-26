
'use strict';

var _ = require('underscore');

// args:
// stickyClass - class to attach to the target element that makes things stick [default: cmuStuck]

// optional args:
// yOffset - extra offset from the top of the viewport
// stickyBound - the bounding container that stops the target from continuing further


function sticky($document, $window) {
	var link = function(scope, element, attrs) {

		var stickyClass = attrs.stickyClass; // class that makes things sticky
		var offset = parseFloat(attrs.offset);
		var fillViewport = false;
		(attrs.fillViewport=="true") ? fillViewport=true : fillViewport=false;

		if (isNaN(offset))
			offset = 0;

		// the container element
		// needs to stay position: relative, with a manually set height
		var container = element[0];
	    var angularContainer = angular.element(element);
	    // var containerHeight = container.offsetHeight;
	    // var windowHeight = $window.innerHeight;

	    // the target within the container
	    // fixed / floating element
	    var target = angularContainer.children()[0];
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
		    var containerDistToViewportTopwOffset = box.top - menuHeight - offset;
		    var containerDistToPageTop = box.top + window.pageYOffset;

			var targetDistToTop = menuHeight;
			var targetWidth = container.offsetWidth;
			if (offset > 0) {
				targetDistToTop += offset;
			}

			// console.log('dist: ' + containerDistToViewportTopwOffset + 'elig: ' + eligible())
		    // console.log('elemBottom: ' + parseFloat(elemHeight+) + 'elemH: ' + elemHeight + ' windowH: ' + windowHeight);
	    	if ((containerDistToViewportTopwOffset < 0) && eligible()) {
				if (!isStuck()) {
					// angularContainer.html(angularContainer.html() + angularContainer.html());
					// container.outerHTML += copy[0].outerHTML;

					// replace with a dummy height so elements don't jolt
					angularContainer.css("height", container.offsetHeight + 'px');
					angularTarget.addClass(stickyClass);

					// console.log('tHeight: ' + targetDistToTop)
					angularTarget.css("top", targetDistToTop + 'px');
					angularTarget.css("width", targetWidth + 'px');

					if (fillViewport && !isTargetSmallerThanViewport()) {
						angularTarget.addClass("cmuStuck--fillViewport");
						angularContainer.addClass("cmuStuck--fillViewportContainer");
					}

				}


			    // optional bounding container
			    var bound;
			    if(attrs.stickyBound == "::parent") {
			    	bound = container.parentElement;
			    } else {
					bound = document.getElementsByClassName(attrs.stickyBound)[0];
			    }

			    if (typeof(bound) != "undefined") {

				    var angularBound = angular.element(bound);
				    var targetBottomToBoundBottom, boundDistToViewportTop, boundHeight, boundBottomDistToViewportTop, boundPadding;
					boundDistToViewportTop = bound.getBoundingClientRect().top;
					var boundDistToPageTop = boundDistToViewportTop + window.pageYOffset
		    	    boundHeight = bound.clientHeight;
		    	    boundPadding = parseInt(window.getComputedStyle(bound).paddingBottom, 10) + parseInt(window.getComputedStyle(bound).paddingTop, 10);
		    	    var containerDistToBoundTop = containerDistToPageTop - boundDistToPageTop;
		    	    // angularBound.css('padding-bottom', '123px');
		    		// console.log('boundElem_paddbott: ' + document.getElementsByClassName(attrs.stickyBound)[0])
		    		
		    	    boundBottomDistToViewportTop = boundDistToViewportTop + boundHeight - boundPadding;
		    	    var boundContentHeight = boundBottomDistToViewportTop - boundDistToPageTop + window.pageYOffset;
		    	    // boundBottom = parseFloat(bound.clientTop+bound.clientHeight); // client keeps it within border
		    	    // console.log(' eeee ' + parseFloat(boundContentHeight - targetHeight - containerDistToPageTop))
		    	    var targetBoundPosition = parseFloat(boundContentHeight - targetHeight - containerDistToBoundTop); // - containerDistToPageTop );

		    		// console.log('boundBottomDistToViewportTop: ' + boundBottomDistToViewportTop + ' boundHeight: ' + boundHeight + ' targetHEight: ' + targetHeight)
		    	    // boundBottomDistToViewportTop = 
		    	    // console.log('boundHeight: ' + parseFloat(bound.clientHeight));
		    	    // console.log(bound)

		    	    // bottom of target to bottom of bound
		    	    targetBottomToBoundBottom = boundBottomDistToViewportTop - targetHeight - offset - menuHeight; //boundBottomDistToViewportTop - targetHeight - boundDistToViewportTop;

				    // console.log('bound:')
				    // console.log(angularBound);
			    	if (targetBottomToBoundBottom < 0 ) {
			    		// console.log('targetBoundPosition= ' + targetBoundPosition + ' (boundContentHeight ' + boundContentHeight + ' - targetHeight ' + targetHeight + ' - containerDistToBoundTop ' + containerDistToBoundTop + ' - containerDistToPageTop ' + containerDistToPageTop + ' - boundDistToPageTop ' + boundDistToPageTop);
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
					angularContainer.css("height");
					angularTarget.removeClass(stickyClass);
					angularTarget.removeClass("cmuStuck--bottom");
					angularTarget.removeClass("cmuStuck--fillViewport");
					angularContainer.removeClass("cmuStuck--fillViewportContainer");
				}
			}
	    });

		function isStuck() {
			return angularTarget.hasClass(stickyClass);
		}

		function isTargetSmallerThanViewport() {
			if ( angularTarget[0].clientHeight <= parseFloat(window.innerHeight - offset) ) return true;
			return false;
		}
		function eligible() {
			// eligible if target height is smaller than viewport height
			// console.log('targetHeight: ' + angularTarget[0].clientHeight + ' windowHeight ' + parseFloat(window.innerHeight - offset) )
			if (isTargetSmallerThanViewport()) return true;
			if (fillViewport) return true; // special case that fills the sticky to the height of the viewport
			return false;
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
	