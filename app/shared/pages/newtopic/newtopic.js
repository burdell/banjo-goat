
function creatNewTopicPage(areaName) {

	require('directives/newtopic/newtopic.js');

	var newTopicController = function($scope, breadcrumbService){
		breadcrumbService.setCurrentBreadcrumb('New Announcement');

		$scope.$on('$stateChangeStart', function(){
			breadcrumbService.clearCurrentBreadcrumb();
		});
	};
	newTopicController.$inject = [
		'$scope', 
		require('services/breadcrumb.js')
	];

	angular.module('community.' + areaName)
		.controller('NewTopic', newTopicController);


}

module.exports = creatNewTopicPage;