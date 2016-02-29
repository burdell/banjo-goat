
'use strict';

require('directives/pageheader/pageheader.js');
require('directives/pager/pager.js');

require('services/localization.js');

var _ = require('underscore');


var subscriptionsController = function(userData, subscriptionsFilter, communityApi, breadcrumbService, routingService){
	var ctrl = this;

	var currentBreadcrumb = breadcrumbService.CurrentBreadcrumb;
	var userName = userData.user.login;
	if (!currentBreadcrumb || currentBreadcrumb.name !== userName) {
		breadcrumbService.setCurrentBreadcrumb(userName);
	}

	subscriptionsFilter.set({
		onFilter: function(result){
			_.each(result.content, function(subscription){
				var subscriptionNode = subscription.topic.node;
				var discussionId = routingService.getDetailId(subscriptionNode.discussionStyle);
				var routeValues = {
					nodeId: subscriptionNode.urlCode
				};
				routeValues[discussionId] = subscription.topic.id;

				subscription.url = routingService.generateUrl(subscriptionNode.discussionStyle + '.detail', routeValues);				
			});
			ctrl.subscriptionList = result.content;
			ctrl.subscriptionCount = result.totalElements;
			ctrl.numberOfPages = result.totalPages;
		}
	})

	_.extend(ctrl, {
		unsubscribe: function(subscriptionId){
			communityApi.Subscriptions.remove(subscriptionId).then(function(){
				subscriptionsFilter.filter();
			});
		},
		subscriptionsFilter: subscriptionsFilter
	});
};

subscriptionsController.$inject = [
	'UserData',
	'UserSubscriptionsFilter', 
	require('services/api.js'),
	require('services/breadcrumb.js'),
	require('services/routing.js')
];

angular.module('community.directory')
	.controller('UserSubscriptions', subscriptionsController);

