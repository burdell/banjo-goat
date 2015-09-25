(function(_){
	'use strict';
	
	function communityTimeline() {
		var link = function(scope, element, attrs) {
		};

		var controller = function($state, timelineService) {
			var ctrl =  this;
			
			var shown = {
				month: null,
				year: null
			};
		
			var timelineData = this.sortedModel ? this.sortedModel : timelineService.getTimelineData(ctrl.timelineModel, ctrl.dateAttribute);
			if (timelineData && timelineData.length > 0) {
				shown.year = timelineData[0].year;
			}

			_.extend(ctrl, {
				timelineData: timelineData,
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
				},
				getTimelineHref: function(data) {
					return this.hrefFn(data);
				},
				go: function(data) {
					$state.go('announcements.detail', { announcementId: data.id, nodeId: data.node.urlCode });
				}
			});
		};
		controller.$inject = ['$state', 'CommunityTimelineService'];

	    var directive = {
	        link: link,
	        controller: controller,
	        templateUrl: 'directives/timeline/timeline.html',
	        controllerAs: 'timeline',
	        bindToController: true,
	        restrict: 'E',
	        scope: {
	        	timelineModel: '=',
	        	timelineItemTemplate: '=',
	        	sortedModel: '=',
	        	dateAttribute: '@',
	        	hrefFn: '=',
	        	showProductInfo: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityTimeline', communityTimeline);
		
}(window._));