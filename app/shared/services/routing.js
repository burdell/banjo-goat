(function(_) {
	'use strict';
	
	var routing = function($location){
		return {
			getCurrentArea: function(){
				return $location.path().split('/')[1];
			},
			areaSlugs: {
				announcements: 'announcements',
				bugs: 'bugs',
				featureRequests: 'features',
				forums: 'forums',
				qna: 'qna',
				stories: 'stories'
			}
		};
	};
	routing.$inject = ['$location'];

	angular.module('community.services')
		.service('CommunityRoutingService', routing);

}(window._));