
'use strict';

var moment = require('moment');

var timeFromNow = function(){
	return function(unixTimestamp){
		var rightNow = moment();
		var postDate = moment(unixTimestamp);
					
		// over 3 days ago
		if (rightNow.subtract(3, 'days').isAfter(postDate)) {
			// return postDate.format('YYYY-MM-DD');

			// localized Month name, day of month, year	LL	September 4 1986
			return postDate.format('ll');
		}

		// only return days, without time stamp
		// return postDate.fromNow() + ", " + postDate.format('hh:mm a');
		return postDate.fromNow();
		// localized Month name, day of month, year, time	LLL	September 4 1986 8:30 PM
		return postDate.fromNow();
	};
};

var exactTimeFromNow = function(){
	return function(unixTimestamp){
		var rightNow = moment();
		var postDate = moment(unixTimestamp);
					
		// over 3 days ago
		if (rightNow.subtract(3, 'days').isAfter(postDate)) {
			// return postDate.format('YYYY-MM-DD') + " at " + postDate.format('hh:mm a');
			return postDate.format('lll');
		}

		return postDate.fromNow() + ", " + postDate.format('LTS');
		// return postDate.fromNow();
	};
};


angular.module('community.filters')
	.filter('timeFromNow', timeFromNow);

angular.module('community.filters')
	.filter('exactTimeFromNow', exactTimeFromNow);

