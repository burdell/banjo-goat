(function(moment){
	'use strict';
	
	var timeFromNow = function(){
		return function(unixTimestamp){
			var rightNow = moment();
			var postDate = moment(unixTimestamp);
						
			if (rightNow.subtract(3, 'days').isAfter(postDate)) {
				return postDate.format('YYYY-MM-DD');
			}

			return postDate.fromNow() + ", " + postDate.format('hh:mm a');
		};
	};
	
	angular.module('community.filters')
		.filter('timeFromNow', timeFromNow);

}(window.moment));