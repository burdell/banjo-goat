
	'use strict';

	require('directives/productnavigator/productnavigator.js');

	function StoriesLandingController (breadcrumbService){
		breadcrumbService.setCurrentBreadcrumb('Stories');
	}
	StoriesLandingController.$inject = [require('services/breadcrumb.js')];

	angular.module('community.stories')
		.controller('StoriesLanding', StoriesLandingController);


