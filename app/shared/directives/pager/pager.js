(function(_, $){
	'use strict';
	
	function communityFilter($timeout) {
		var link = function(scope, element, attrs) {
			var pagerSettings = {
				scrollRate: 0.75,
				minPagesForScroller: 8,
			};
			var $element = $(element);

			/****** EXPOSED PROPERTIES ******/
			function setUiPage(page) {
				var pagerInfo = scope.pager.info;
				
				if (!page) {
					page = pagerInfo.initialPage;
				}

				var totalPages = pagerInfo.numberOfPages;
				if(page >= 1 && page <= totalPages) {
					// only scroll scrub if we have more pages 
					var position = null;
					if (totalPages >= pagerSettings.minPagesForScroller) {
						position = scrollScrubber(page, totalPages);
					}

					enableScrollControls(position, totalPages);
					enableNextAndPrevious(page, totalPages);

					setActive(page);
				}
			}

			function scroll(dir){
				var previousOrNext = (dir === 'right' ? 'scrollRight' : 'scrollLeft');
				if (scope.disabledButtons[previousOrNext]) {
					return;
				}

				var scrubber = $element.find('.cmuPagination__main__scrubber');

				var scrubberWidth = $(scrubber).outerWidth();
				var numWidth = $element.find('.cmuPagination__num').outerWidth();
				var scrubberOffset = parseInt(scrubber.css('left'), 10);

				var totalPages = scope.pager.info.numberOfPages;
				var maxWidth = (totalPages-1) * numWidth; //using totalpages-1 b/c first page is not in the scrubber
				var maxPosition = maxWidth - scrubberWidth;

				if (dir === 'left') {
					scrubberWidth *= -1;
				}

				var position = scrubberWidth * pagerSettings.scrollRate + scrubberOffset * -1;

				// put in some limiters so we don't overscroll
				if (position <= 0) {
					position = 0; 
				} else if (position >= maxPosition && dir === 'right') {
					position = maxPosition;
				}

				scrubber.css({left: position * -1}); 
				enableScrollControls(position, totalPages);
			}

			var pagerInfo = scope.pager.info;
		  	_.extend(scope, {
		  		setUiPage: setUiPage,
		  		scroll: scroll,
		  		disabledButtons: {
		  			next: false,
		  			previous: false,
		  			scrollLeft: false,
		  			scrollRight: false
		  		},
		  		pagerDisplay: {
		  			isFullSlider: pagerInfo.numberOfPages >= pagerSettings.minPagesForScroller
		  		},
		  		pageRange: function(){
					//first page is hard-coded, therefore start from 2
					return _.range(2, pagerInfo.numberOfPages + 1);
				}
		  	});

		  	//use $timeout so DOM is rendered before this runs
		  	$timeout(function(){
				scope.setUiPage();
			}, 0);

		  	/****** INTERNAL PROPERTIES ******/
			function setActive(page) {
				$element.find('.cmuPagination__num')
					.removeClass('active')
					.filter(function(index, el){
						return el.dataset.val === (page + '');
					})
					.addClass('active');
			}

			function scrollScrubber(targetPage, totalPages) {
				// note that we move/animate the entire scrubber within its _main container
			   	var scrubber = $element.find('.cmuPagination__main__scrubber');
			    var target = $element.find('.cmuPagination__num[data-val='+targetPage+']');
			    var targetPosition = target.position();

			    // check if target exists, escape if it doesn't
			    if(typeof targetPosition === 'undefined'){
			       return;
			    }

			    var targetFromLeft = target.position().left;
			    var numWidth = $element.find('.cmuPagination__num').outerWidth();

			    var scrubberLeft = scrubber.position().left;
			    var scrubberWidth = scrubber.outerWidth();
			    var scrubberMid = scrubberLeft + scrubberWidth/2;
			    var scrubberOffset = parseInt(scrubber.css('left'), 10); // everything is relative

			    var maxWidth = (totalPages-1) * numWidth; //using totalpages-1 b/c first page is not in the scrubber
			    var maxPosition = maxWidth - scrubberWidth;

			    // set midpoint position
			    var position = scrubberOffset + targetFromLeft - (scrubberMid - numWidth/2);

			    if (position <= 0) {
			      position = 0;
			    } else if (position >= maxPosition ) {
			      position = maxPosition;
			    }

			    // animate the scrubber
			    scrubber.css({left: position * -1});

			    return position;
			}

			function enableScrollControls(futureOffset, totalPages) {
				var scrubber = $element.find('.cmuPagination__main__scrubber');

				var scrubberWidth = scrubber.outerWidth();
				var scrubberOffset = parseInt(scrubber.css('left'), 10) * -1;
				var numWidth = $('.cmuPagination__num').outerWidth();
				if (!isNaN(futureOffset)) { scrubberOffset = futureOffset; }


				var maxWidth = (totalPages-1) * numWidth; //using totalpages-1 b/c first page is not in the scrubber
				var maxPosition = maxWidth - scrubberWidth;

				_.extend(scope.disabledButtons, {
					scrollLeft: scrubberOffset <= 0,
					scrollRight: scrubberOffset >= maxPosition
				});
			}

			function enableNextAndPrevious(currentPage, totalPages){
				_.extend(scope.disabledButtons, {
					next: currentPage === totalPages,
					previous: currentPage === 1
				});
			}
		};

		var controller = function($scope, filterService) {
			var ctrl = this;
			var filterer = this.pagerFn ? this.pagerFn : filterService.getNewFilter();  

			ctrl.pageBased = ctrl.offsetBased ? false : true;

			/*** CONTROL FUNCTIONS *****/
			function page() {
				setUiPage();
				filterer.filter(pageData);
			}

			function nextPage (){
				if ($scope.disabledButtons.next) {
					return;
				}
				
				if (ctrl.pageBased) {
					pageData.page += 1;
				} else {
					pageData.offset += pageData.limit;
				}

				page();
			}

			function previousPage(){
				if ($scope.disabledButtons.previous) {
					return;
				}

				if (ctrl.pageBased) {
					pageData.page -= 1;
					if (pageData.page < 0) {
						pageData.page = 0;
					}	
				} else {
					pageData.offset -= pageData.limit;
					if (pageData.offset < 0) {
						pageData.offset = 0;
					}	
				}
				
				page();
			}

			function goToPage(pageNumber, disabled) {
				if (disabled) {
					return;
				}

				if (ctrl.pageBased) {
					pageData.page = Number(pageNumber);
				} else {
					pageData.offset = (Number(pageNumber) - 1) * pageData.limit;
				}
				
				page();
			}

			/**** UI Functions *****/
			function getPageNumber(){
				if (ctrl.pageBased) {
					return pageData.page;
				} 

				return (Math.floor(pageData.offset / pageData.limit) + 1);
			}

			function setUiPage() {
				var currentPage = getPageNumber();
				$scope.setUiPage(currentPage);
			}

			/**** PAGER DATA *****/
			var defaultLimit = Number(filterer.model('limit')) || 30;
			var defaultOffset = Number(filterer.model('offset')) || 0;

			var defaultPage = Number(filterer.model('page')) || 1;

			var pageData = ctrl.pageBased ? { page: defaultPage } : { limit: defaultLimit, offset: defaultOffset };

			function syncPagerToFilter(){
				if (ctrl.pageBased) {
					var page = filterer.model('page');
					if (!page && page !== 0) {
						page = defaultPage;
					}
					pageData.page = page;
				} else {
					var filterLimit = filterer.model('limit');
					var filterOffset = filterer.model('offset');

					pageData.limit = filterLimit !== undefined ? Number(filterLimit) : Number(defaultLimit);
					pageData.offset = filterOffset !== undefined ? Number(filterOffset) : Number(defaultOffset);

				}

				setUiPage();
			}
			filterer.set({ onFilter: syncPagerToFilter });
			
			var numberOfPages = ctrl.pageBased ? ctrl.numberOfPages : Math.ceil(Number(this.totalResults) / pageData.limit);
			var pagerInfo = {
				initialPage: getPageNumber(),
				numberOfPages: numberOfPages,
				frontBiased: this.frontBiased === 'true'
			};
			
			/***** EXPOSED PROPERTIES *****/
			_.extend(ctrl, {
				nextPage: nextPage,
				previousPage: previousPage,
				goToPage: goToPage,
				info: pagerInfo
			});
		};
		controller.$inject = ['$scope', 'CommunityFilterService'];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/pager/pager.html',
	        controllerAs: 'pager',
	        bindToController: true,
	        restrict: 'AE',
	        scope: {
	        	allowEnd: '@',
	        	pageSize: '@',
	        	pagerFn: '=',
	        	totalResults: '=',
	        	frontBiased: '@',
	        	offsetBased: '=',
	        	numberOfPages: '='
	        }
	    };

	    return directive;
	}
	communityFilter.$inject = ['$timeout'];

	angular.module('community.directives')
		.directive('communityPager', communityFilter);
		
}(window._, window.jQuery));