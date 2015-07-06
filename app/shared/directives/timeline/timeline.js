(function(_){
	'use strict';
	
	function communityTimeline() {
		var link = function(scope, element, attrs) {
		};

		var controller = function(timelineService) {
			var ctrl =  this;
			
			var shown = {
				month: null,
				year: null
			};

			_.extend(ctrl, {
				timelineData: timelineService.getTimelineData(ctrl.timelineModel, ctrl.dateAttribute),
				yearClicked: function(year) {
					shown.year = shown.year == year ? null : year;
				},
				monthClicked: function(month){
					shown.month = shown.month == month ? null : month;
				},
				showYear: function(year) {
					return year === shown.year;
				},
				showMonth: function(month, year) {
					return shown.year === year && shown.month === month;
				}

			});
		};
		controller.$inject = ['CommunityTimelineService'];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/timeline/timeline.html',
	        controllerAs: 'timeline',
	        bindToController: true,
	        restrict: 'E',
	        scope: {
	        	timelineModel: '=',
	        	dateAttribute: '@'

	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityTimeline', communityTimeline);
		
}(window._));