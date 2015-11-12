
'use strict';

var _ = require('underscore');

require('directives/pager/pager.js');
require('directives/username/username.js');
require('directives/useravatar/useravatar.js');

require('filters/timefromnow.js');

var notificationsController = function($scope, breadcrumbService, notificationsService, notificationsFilter){
	var ctrl = this;

	function setNotificationData(result) {
		ctrl.totalCount = result.totalElements;
		ctrl.totalPages = result.totalPages;
		ctrl.notificationList = result.content;
	};
	notificationsFilter.set({ onFilter: setNotificationData });

	_.extend(ctrl, {
		notificationsFilter: notificationsFilter,
		getActionString: function(notification) {
			return notificationsService.getActionString(notification);
		},
		getUrl: function(notification) {
			return notificationsService.generateNotificationUrl(notification);
		}
	});

	breadcrumbService.setCurrentBreadcrumb('My Notifications');
	$scope.$on('$stateChangeStart', function(){
		breadcrumbService.clearCurrentBreadcrumb();
	});
};
notificationsController.$inject = ['$scope', require('services/breadcrumb.js'), require('services/notifications.js'), 'NotificationsFilter'];

angular.module('community.directory')
	.controller('Notifications', notificationsController);

