
'use strict';

var moment = require('moment');

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

var exactTimeFromNow = function(){
	return function(unixTimestamp){
		var rightNow = moment();
		var postDate = moment(unixTimestamp);
					
		if (rightNow.subtract(3, 'days').isAfter(postDate)) {
			return postDate.format('YYYY-MM-DD') + " " + postDate.format('hh:mm a');
		}

		return postDate.fromNow() + ", " + postDate.format('hh:mm a');
	};
};


angular.module('community.filters')
	.filter('timeFromNow', timeFromNow);

angular.module('community.filters')
	.filter('exactTimeFromNow', exactTimeFromNow);

