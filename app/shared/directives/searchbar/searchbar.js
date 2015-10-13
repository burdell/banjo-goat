(function(_){
	'use strict';
	
	function searchBar() {
		var controller = function($rootScope, $scope, utils) {
			var ctrl = this;

			$scope.$on('searchbar:' + ctrl.openEvent, function(){
				console.log('searchbar trigger')
				ctrl.toggleMenu();
			});

			$scope.$on('$stateChangeStart', function(){
				ctrl.isOpen = false;
			});

			$rootScope.$on('rootScope:closeAllDropdowns', function(){
				ctrl.isOpen = false;
			});

			_.extend(ctrl, {
				isOpen: false,
				toggleMenu: function(){
					if(!ctrl.isOpen) {
						$scope.$emit('rootScope:closeAllDropdowns');
					}

					ctrl.isOpen = !ctrl.isOpen;
					// utils.preventBodyScroll(ctrl.isOpen);
				}
			});
		};
		controller.$inject = ['$rootScope', '$scope', 'CommunityUtilsService'];

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