
'use strict';

 var $ = require('jquery');
 var jQBridget = require('jquery-bridget');
 var Masonry = require('masonry-layout');
 var imagesloaded = require('imagesloaded');

 $.bridget('masonry', Masonry);
 
function gridList($timeout) {
	function link(scope, element, attrs) {
		var $element = $(element);

		function init(reload, options) {
			$timeout(function(){
				//var grid = $element.masonry(options);
				if (!reload) {
					//$element.hide();
				}

				imagesloaded($element).on('progress', function(){
					$element.show();

					if (reload) {
						$element.masonry('reloadItems');
					} else {
						$element.show();
					}

					$element.masonry(options);
					$element.masonry('layout');
				});
				
			});
		}
		init(false, {
			itemSelector: '.cmuStoryGrid__item',
			gutter: 14,
			columnWidth: '.cmuStoryGrid__item',
			isAnimated: false
		});

		scope.$on('communityGridList:redraw', function(){
			init(true);
		});
	}

	function controller() {	
		
	}
	controller.$inject = ['$compile', '$scope'];
    
    var directive = {
        link: link,
        controller: controller,
        restrict: 'A',
        controllerAs: 'fluidlayout',
        bindToController: true,
        scope: {
        	tileTemplate: '=',
        	tileList: '='
        }	        
    };

    return directive;
}
gridList.$inject = ['$timeout'];

angular.module('community.stories')
	.directive('communityGridList', gridList);
