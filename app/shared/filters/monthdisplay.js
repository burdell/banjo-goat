'use strict';

var months = [
	'January', 
	'February', 
	'March', 
	'April', 
	'May', 
	'June', 
	'July', 
	'August',
	'September',
	'October',
	'November',
	'December'
];

var monthDisplay = function(){
	return function(monthIndex){
		return months[monthIndex];
	};
};

angular.module('community.filters')
	.filter('monthDisplay', monthDisplay);

