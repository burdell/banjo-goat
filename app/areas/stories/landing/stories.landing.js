(function(_){
	'use strict';

	function StoriesLandingController (breadcrumbService){
		breadcrumbService.setCurrentBreadcrumb('Stories');
	}
	StoriesLandingController.$inject = ['CommunityBreadcrumbService'];

	angular.module('community.stories')
		.controller('StoriesLanding', StoriesLandingController);

}(window._));
