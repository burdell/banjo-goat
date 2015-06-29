(function(_, moment) {
	'use strict';

	function groupData(dataList, dateProperty){
		 _.each(dataList, function(data){
			var momentDate = moment(data[dateProperty]);

			_.extend(data, {
				month: momentDate.month(),
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
				yearObj.yearData.push({ month: month, monthData: data });
			});

			groupedData.push(yearObj);
		});

 		return _.sortBy(groupedData, function(data){
 			return -(data.year);
 		});
	};

	var timelineService = function(){
		return {
			getTimelineData: function(dataList, sortBy) {
				return groupData(dataList, sortBy);;
			}
		};
	};

	angular.module('community.services')
		.service('CommunityTimelineService', timelineService);

}(window._, window.moment));