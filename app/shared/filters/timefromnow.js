(function(moment){
	'use strict';
	
	var timeFromNow = function(){
		return function(unixTimestamp){
			var rightNow = moment();
			var postDate = moment(unixTimestamp);
						
			if (rightNow.subtract(3, 'weeks').isAfter(postDate)) {
				return postDate.format('MMMM D, YYYY');
			}

			return postDate.fromNow();
		};
	};
	
	angular.module('community.shared')
		.filter('timeFromNow', timeFromNow);

}(window.moment));