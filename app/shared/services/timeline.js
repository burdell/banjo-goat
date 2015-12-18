
'use strict';

var _ = require('underscore');
var moment = require('moment');

function groupData(dataList, datePropertyFn){
	_.each(dataList, function(discussion){
	 	var date = datePropertyFn(discussion);

		var momentDate = moment(date);
		_.extend(discussion, {
			month: momentDate.month(),
			monthDisplay: momentDate.format('MMMM'),
			year: momentDate.year()
		})
	});

	var dataByYear = _.groupBy(dataList, function(data){
		return  data.year;
	});
	
	var groupedData = [];
	_.each(dataByYear, function(yearData, year){
		var yearObj = {
			year: year,
			yearData: [],
			count: 0
		};

		var dataByMonth = _.groupBy(yearData, function(data){
			return data.month;
		});

		_.each(dataByMonth, function(data, month){
			yearObj.count += data.length
			yearObj.yearData.unshift({ month: month, monthDisplay: data[0].monthDisplay, monthData: data });
		});
		groupedData.push(yearObj);
	});
	
	return _.sortBy(groupedData, function(data){
		return -(data.year);
	});
};

var timelineService = function($parse){
	return {
		getTimelineData: function(dataList, sortBy) {
			var sortByFn = $parse(sortBy);
			return groupData(dataList, sortByFn);
		}
	};
};
timelineService.$inject = ['$parse'];

angular.module('community.services')
	.service('CommunityTimelineService', timelineService);
