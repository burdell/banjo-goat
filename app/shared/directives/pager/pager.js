(function(_){
	//'use strict';
	
	function communityFilter($timeout) {
		var link = function(scope, element, attrs) {
			var currentPage = null;
			var position = null;
			
			scope.setUiPage= function(page) {
				var pagerInfo = scope.pager.info;
				
				if (!page) {
					page = pagerInfo.initialPage;
				}
				var totalPages = pagerInfo.numberOfPages;
				var minPagesForScroller = pagerInfo.minPagesForScroller;
				if(page >= 1 && page <= totalPages) {
					currentPage = page; // this has to happen before scrollscrubber

					// only scroll scrub if we have more pages 
					if (totalPages >= minPagesForScroller) {
						scrollScrubber(page, totalPages);
					}

					enableControls(position, totalPages);
					setActive(page);
				}
			}

			// sets the current / active page
			// this is ONLY used to a page class to active
			function setActive(page) {
				curPage = page; 
				element.find('.pagination_num')
					.removeClass('active')
					.filter(function(index, el){
						return el.dataset.val === (page + '');
					})
					.addClass('active');
			}

			$timeout(function(){
				scope.setUiPage();
			}, 0)

			var scrubber = element.find('.pagination_main_scrubber');
			function scrollScrubber(targetPage, totalPages) {
				// note that we move/animate the entire scrubber within its _main container
			   
			    var target = element.find('.pagination_num[data-val='+targetPage+']');
			    var targetPosition = target.position();

			    // check if target exists, escape if it doesn't
			    if(typeof targetPosition === 'undefined'){
			       return;
			     };

			    var targetFromLeft = target.position().left;
			    var numWidth = element.find('.pagination_num').outerWidth();

			    var scrubberLeft = scrubber.position().left;
			    var scrubberWidth = scrubber.outerWidth();
			    var scrubberMid = scrubberLeft + scrubberWidth/2;
			    var scrubberOffset = parseInt(scrubber.css('left'), 10); // everything is relative

			    var maxWidth = (totalPages-1) * numWidth; //using totalpages-1 b/c first page is not in the scrubber
			    var maxPosition = maxWidth - scrubberWidth;

			    // set midpoint position
			    position = scrubberOffset + targetFromLeft - (scrubberMid - numWidth/2);

			    if (position <= 0) {
			      position = 0;
			    } else if (position >= maxPosition ) {
			      position = maxPosition;
			    }
			    // animate the scrubber
			    scrubber.css({left: position * -1});
			}

			  // enable or disable controls. futureOffset is called b/c scrubber is still being scrolled
			  // so scrubberOffset will give the wrong info until css anim stops
			  function enableControls(futureOffset, totalPages) {
			    var scrubberWidth = scrubber.outerWidth();
			    var scrubberOffset = parseInt(scrubber.css('left'), 10) * -1;
			    var numWidth = $('.pagination_num').outerWidth();
			    if (!isNaN(futureOffset)) { scrubberOffset = futureOffset; }

			   
			    var maxWidth = (totalPages-1) * numWidth; //using totalpages-1 b/c first page is not in the scrubber
			    var maxPosition = maxWidth - scrubberWidth;

			    scope.disableLeftArrows = scrubberOffset <= 0;
			    scope.disableRightArrows = scrubberOffset >= maxPosition;

			    scope.disablePreviousPage = currentPage === 1;
			    scope.disableNextPage = currentPage === totalPages;

			  };

			  scope.scroll = function(dir, totalPages){
				var scrubberWidth = $(scrubber).outerWidth();
				var numWidth = element.find('.pagination_num').outerWidth();
				var scrubberOffset = parseInt(scrubber.css('left'), 10);

				var maxWidth = (totalPages-1) * numWidth; //using totalpages-1 b/c first page is not in the scrubber
				var maxPosition = maxWidth - scrubberWidth;

				if (dir == 'left') {
					scrubberWidth *= -1;
				}

				var scrollRate = .75;
				var position = scrubberWidth * scrollRate + scrubberOffset * -1;

				// put in some limiters so we don't overscroll
				if (position <= 0) {
					position = 0; 
				} else if (position >= maxPosition && dir == 'right') {
					position = maxPosition;
				}

				scrubber.css({left: position * -1});

				enableControls(position);
			  }
		};

		var controller = function($scope, filterService, communityApi, utils) {
			var ctrl = this;
			var filterer = this.pagerFn ? this.pagerFn : filterService.getNewFilter();  

			/**** PAGER DATA *****/
			var defaultLimit = this.pageSize || 30;
			var defaultOffset = filterer.model('offset') || 0

			var pageData = {
				limit: Number(this.pageSize) || defaultLimit,
				offset: this.pagerFn.model('offset') || defaultOffset
			};

			function syncPagerToFilter(){
				pageData.limit = Number(filterer.model('limit')) || defaultLimit;
				pageData.offset = Number(filterer.model('offset')) || defaultOffset;

				setUiPage();
			}
			filterer.set({ onFilter: syncPagerToFilter });


			var pagerSettings = {
				scrollRate: .75,
				minPagesForScroller: 8
			};

			var numberOfPages = Math.ceil(Number(this.totalResults) / pageData.limit);
			var pagerInfo = {
				initialPage: getPageNumber(),
				numberOfPages: numberOfPages,
				isFullSlider:  numberOfPages >= pagerSettings.minPagesForScroller,
				simpleClass: 'simple-scroll',
				fullClass: 'full-scroll',
				minPagesForScroller: pagerSettings.minPagesForScroller
			};

			/*** CONTROL FUNCTIONS *****/
			function page() {
				setUiPage();
				filterer.filter(pageData);
			}

			function nextPage (){
				pageData.offset += pageData.limit;
				page();
			}

			function previousPage(){
				pageData.offset -= pageData.limit;
				if (pageData.offset < 0) {
					pageData.offset = 0;
				}
				page();
			}

			function goToPage(pageNumber) {
				pageData.offset = (Number(pageNumber) - 1) * pageData.limit;
				page();
			}

			/**** UI Functions *****/
			function getPageNumber(){
				return (Math.floor(pageData.offset / pageData.limit) + 1);
			}

			function setUiPage() {
				var currentPage = getPageNumber();
				$scope.setUiPage(currentPage);
			}

			/***** EXPOSED PROPERTIES *****/
			_.extend(ctrl, {
				nextPage: nextPage,
				previousPage: previousPage,
				goToPage: goToPage,
				pageRange: function(){
					//first page is hard-coded, therefore start from 2
					return _.range(2, pagerInfo.numberOfPages + 1);
				},
				info: pagerInfo
			});
		};
		controller.$inject = ['$scope', 'CommunityFilterService', 'CommunityApiService'];

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
	        	totalResults: '='
	        }
	    };

	    return directive;
	}
	communityFilter.$inject = ['$timeout'];

	angular.module('community.directives')
		.directive('communityPager', communityFilter);
		
}(window._));