(function(_){
	//'use strict';
	
	function communityFilter() {
		var link = function(scope, element, attrs) {
			// var curPage = 1, totalPages = 25;
			// var scrollRate = 0.75; // rate of scrolling the scrubber sideways
			// var minPagesForScroller = 8; // minimum number of pages needed to show busy scroller

			// // build the total pages
			// setTotalPafges(totalPages);

			// // set current page, and go to default first page
			// goToPage(curPage);


			// // 
			// // CONTROLLERS
			// // 

			// // set total pages
			// // 
			// function setTotalPages(pages) {
			// 	totalPages = pages; 
			// 	output = '';

			// 	// If 7 pages or fewer, apply .simple-scroll:
			// 	// disable some pagination/scrubber controls for usability
			// 	// note on 'full-scroll' class- Chrome and FF doesn't override flexbox correctly,
			// 	// so we tack on / remove this class between the two modes
				
			// 	$('.simple-scroll').removeClass('simple-scroll');
			// 	$('.full-scroll').removeClass('full-scroll');
			// 	if (totalPages < minPagesForScroller) {
			// 		$('.pagination_arrow').addClass('simple-scroll');
			// 		$('.pagination_last').addClass('simple-scroll');
			// 		$('.pagination_first').addClass('simple-scroll');
			// 		$('.pagination_scrubber').addClass('simple-scroll');
			// 		$('.pagination_main').addClass('simple-scroll');
			// 	} else {
			// 		$('.pagination_main').addClass('full-scroll');
			// 	}


			// 	// start i at 1, since the first page doesn't scroll with the rest and isn't generated
			// 	for (i=1; i<pages; i++) {
			// 		val = i+1;
			// 		output += '<div class="pagination_num" data-val="'+val+'">'+val+'</div>';
			// 	}
			// 	$('.pagination_main_scrubber').html(output);

			// 	// set last page value
			// 	$('.pagination_last_num').html(totalPages);
			// 	$('.pagination_last_num').attr("data-val",totalPages);

			// 	// display correct page count
			// 	$('.totalInput').val(totalPages);

			// 	// reset the scrubber
			// 	var scrubber = $('.pagination_main_scrubber');
			// 	$(scrubber).css({left: 0});

			// 	// must rebind all pages since recreated
			// 	bindPages();

			// 	// required for demo resets
			// 	goToPage(1);
			// }


			// // used to "Go" to a page:
			// // 1. set the active page in scrubber
			// // 2. set the scrubber and animate
			// // 3. set state to content
			// function goToPage(page) {
			// 	if( page>=1 && page<=totalPages) {
			// 		curPage = page; // this has to happen before scrollscrubber

			// 		// only scroll scrub if we have more pages 
			// 		if (totalPages >= minPagesForScroller) {
			// 			scrollScrubber(page);
			// 		}

			// 		setActive(page);
			// 	}
			// }

			// // sets the current / active page
			// // this is ONLY used to a page class to active
			// function setActive(page) {
			// 	curPage = page; 
			// 	// console.log('set current page to ' + page)
			// 	$('.pagination_num').removeClass('active');
			// 	$('.pagination_num[data-val='+page+']').addClass('active');

			// 	// display correct active page
			// 	$('.activePage').val(curPage);
			// }

			// // enable or disable controls. futureOffset is called b/c scrubber is still being scrolled
			// // so scrubberOffset will give the wrong info until css anim stops
			// function enableControls(futureOffset) {
			// 	var scrubber = $('.pagination_main_scrubber');
			// 	var scrubberWidth = $(scrubber).outerWidth();
			// 	var scrubberOffset = parseInt($(scrubber).css('left'), 10) * -1;
			// 	var numWidth = $('.pagination_num').outerWidth();
			// 	if (!isNaN(futureOffset)) { scrubberOffset = futureOffset; }

			// 	console.log('curPage: ' + curPage + ' future: ' + futureOffset + ' scrubberWidth: ' + scrubberWidth)

			// 	var maxWidth = (totalPages-1) * numWidth; //using totalpages-1 b/c first page is not in the scrubber
			// 	var maxPosition = maxWidth - scrubberWidth;

			// 	// enable / disable arrows
			// 	if( scrubberOffset <= 0 ) { disableLeftArrows(); } else { enableLeftArrows() }
			// 	if( scrubberOffset >= maxPosition ) { disableRightArrows(); } else { enableRightArrows() } 

			// 	// enable / disable text controls
			// 	if( curPage == 1 ) { disableLeftControls(); } else { enableLeftControls() }
			// 	if( curPage == totalPages ) { disableRightControls(); } else { enableRightControls() } 

			// };


			// // 
			// // RESPONSES
			// // 

			// // set scrubber position w/respect to a page
			// // tries to scroll the scrubber so the selected page is in center
			// function scrollScrubber(targetPage) {

			// 	// note that we move/animate the entire scrubber within its _main container
			// 	var scrubber = $('.pagination_main_scrubber');
			// 	var target = $('.pagination_num[data-val='+targetPage+']');

			// 	// check if target exists, escape if it doesn't
			// 	if(typeof $(target).position() === 'undefined'){
			// 	   return -1;
			// 	 };

			// 	var targetFromLeft = $(target).position().left;
			// 	var numWidth = $('.pagination_num').outerWidth();

			// 	var scrubberLeft = $(scrubber).position().left;
			// 	var scrubberWidth = $(scrubber).outerWidth();
			// 	var scrubberMid = scrubberLeft + scrubberWidth/2;
			// 	var scrubberOffset = parseInt($(scrubber).css('left'), 10); // everything is relative

			// 	var maxWidth = (totalPages-1) * numWidth; //using totalpages-1 b/c first page is not in the scrubber
			// 	var maxPosition = maxWidth - scrubberWidth;

			// 	// set midpoint position
			// 	position = scrubberOffset + targetFromLeft - (scrubberMid - numWidth/2);

			// 	if (position <= 0) {
			// 		position = 0;
			// 	} else if (position >= maxPosition ) {
			// 		position = maxPosition;
			// 	}

			// 	console.log(" position: " + position + ' maxWidth: ' + maxWidth + ' maxWidth - scrubberWidth: ' + (maxWidth - scrubberWidth));

			// 	// animate the scrubber
			// 	$(scrubber).css({left: position * -1});

			// 	enableControls(position);
			// }

			// // scrolls the scrubber to the left or to the right
			// function scroll(dir) {
			// 	var scrubber = $('.pagination_main_scrubber');
			// 	var scrubberWidth = $(scrubber).outerWidth();
			// 	var numWidth = $('.pagination_num').outerWidth();
			// 	var scrubberOffset = parseInt($(scrubber).css('left'), 10);

			// 	var maxWidth = (totalPages-1) * numWidth; //using totalpages-1 b/c first page is not in the scrubber
			// 	var maxPosition = maxWidth - scrubberWidth;

			// 	if (dir == 'left') {
			// 		scrubberWidth *= -1;
			// 	}
			// 	var position = scrubberWidth * scrollRate + scrubberOffset * -1;

			// 	// put in some limiters so we don't overscroll
			// 	if (position <= 0) {
			// 		position = 0; 
			// 	} else if (position >= maxPosition && dir == 'right') {
			// 		position = maxPosition;
			// 		console.log('totalPages: ' + totalPages + 'numWidth: ' + numWidth + ' scrubWidth: ' + scrubberWidth + ' position: ' + maxPosition)
			// 	}

			// 	$(scrubber).css({left: position * -1});

			// 	enableControls(position);
			// }

			// function enableRightArrows() { $('.pagination_arrow_right').removeClass('disabled'); }
			// function disableRightArrows() { $('.pagination_arrow_right').addClass('disabled'); }
			// function enableLeftArrows() { $('.pagination_arrow_left').removeClass('disabled'); }
			// function disableLeftArrows() { $('.pagination_arrow_left').addClass('disabled'); }

			// function enableRightControls() { $('.pagination_control_next').removeClass('disabled'); }
			// function disableRightControls() { $('.pagination_control_next').addClass('disabled'); }
			// function enableLeftControls() { $('.pagination_control_prev').removeClass('disabled'); }
			// function disableLeftControls() { $('.pagination_control_prev').addClass('disabled'); }




			// // 
			// // UI BINDINGS
			// // 

			// // click on a number to set the active page
			// function bindPages() {
			// 	$('.pagination_num').bind('click', function(){ 
			// 		goToPage($(this).data('val'))
			// 	});
			// }

			// // change the total pages
			// $('.totalInput').bind('input', function(){ 
			// 	setTotalPages($('.totalInput').val());
			// });

			// // only allow clicking to the end if it's enabled (only full pagination)
			// $('.pagination_last').each(function(){ 
			// 	if( $(this).hasClass('enabled') )  {
			// 		$(this).children('.pagination_last_num').bind('click', function(){ 
			// 			goToPage($(this).data('val'))
			// 		});
			// 	}
			// });

			// // if ($('.pagination_last').hasClass('enabled')) {
			// // 	$('.pagination_last_num').bind('click', function(){ 
			// // 		goToPage($(this).data('val'))
			// // 	});
			// // }

			// // scroll scrubber to right
			// $('.pagination_arrow_right').bind('click', function() {
			// 	scroll('right');
			// });

			// // scroll scrubber to right
			// $('.pagination_arrow_left').bind('click', function() {
			// 	scroll('left');
			// });

			// // go to next page
			// $('.pagination_control_next').bind('click', function() {
			// 	goToPage(++curPage);
			// });

			// // go to prev page
			// $('.pagination_control_prev').bind('click', function() {
			// 	goToPage(--curPage);
			// });
		};

		var controller = function($scope, filterService, communityApi, utils) {
			var ctrl = this;
			var filterer = this.pagerFn ? this.pagerFn : filterService.getNewFilter();  


			/**** PAGER DATA *****/
			var pageData = {
				limit: Number(this.pageSize) || 30,
				offset: 0
			};

			var pagerSettings = {
				scrollRate: .75,
				minPagesForScroller: 8
			};

			var numberOfPages = Math.ceil(Number(this.totalResults) / pageData.limit);
			var pagerInfo = {
				numberOfPages: numberOfPages,
				isFullSlider:  numberOfPages >= pagerSettings.minPagesForScroller,
				simpleClass: 'simple-scroll',
				fullClass: 'full-scroll'
			};

			/*** CONTROL FUNCTIONS *****/
			function page() {
				filterer.filter(pageData).then(function(result){
					ctrl.pagedList = result.content;
				});
			}

			function nextPage (){
				pageData.offset += this.pageSize;
				page();
			}

			function previousPage(){
				pageData.offset -= this.pageSize;
				if (pageData.offset < 0) {
					pageData.offset = 0;
				}
				page();
			}

			/***** EXPOSED PROPERTIES *****/
			_.extend(ctrl, {
				nextPage: nextPage,
				previousPage: previousPage,
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
	        	pagedList: '=',
	        	pageSize: '@',
	        	pagerFn: '=',
	        	totalResults: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityPager', communityFilter);
		
}(window._));