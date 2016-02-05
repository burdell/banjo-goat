
'use strict';

require('directives/tooltip/tooltip.js');
require('shared/services/timeline.js');
require('shared/filters/monthdisplay.js');
require('shared/filters/extractkey.js');
require('shared/filters/timefromnow.js');
require('directives/username/username.js');
require('directives/useravatar/useravatar.js');
require('directives/productdiscussiontag/productdiscussiontag.js');

var _ = require('underscore');

function communityTimeline() {
	var link = function(scope, element, attrs) {
	};

		var controller = function($state, timelineService, routingService, communityApiService) {
			var ctrl =  this;
			var announcementNodeId = $state.params.nodeId;
			
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
				getProfileUrl: function(id) {
					return routingService.generateUrl('userprofile', { userId: id })
				},
				go: function(data) {
					$state.go('announcements.detail', { announcementId: data.id, nodeId: data.topic.node.urlCode });
				},
				isRead: function(data){
					return !!data.context.lastReadDate;
				},
				getUserData: communityApiService.Users.userData
			});
		};
		controller.$inject = ['$state', 'CommunityTimelineService', 'CommunityRoutingService', require('services/api.js')];

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
		
