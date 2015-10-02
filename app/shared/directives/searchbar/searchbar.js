(function(_){
	'use strict';
	
	function searchBar() {
		var controller = function($scope, utils) {
			var ctrl = this;

			$scope.$on('searchbar:' + ctrl.openEvent, function(){
				ctrl.toggleMenu();
			});

			$scope.$on('$stateChangeStart', function(){
				ctrl.isOpen = false;
			});

			_.extend(ctrl, {
				isOpen: false,
				toggleMenu: function(){
					utils.closeOverlays();
					ctrl.isOpen = !ctrl.isOpen;
					// utils.preventBodyScroll(ctrl.isOpen);
				}
			});
		};
		controller.$inject = ['$scope', 'CommunityUtilsService'];

	    var directive = {
	        controller: controller,
	        templateUrl: 'directives/searchbar/searchbar.html',
	        controllerAs: 'searchbar',
	        bindToController: true,
	        restrict: 'E',
	        scope: {
	        	openEvent: '@',
	        	menuTemplateUrl: '@',
	        	templateCtrl: '='
	        }
	    };
	    return directive;
	}

	angular.module('community.directives')
		.directive('communitySearchBar', searchBar);
		
}(window._));