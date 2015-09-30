(function(_){
	'use strict';
	
	function dropDown() {
		var controller = function($scope, utils) {
			var ctrl = this;

			$scope.$on('dropdown:' + ctrl.openEvent, function(){
				console.log('dropdown hey!')
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
	        templateUrl: 'directives/dropdown/dropdown.html',
	        controllerAs: 'dropdown',
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
		.directive('communityDropDown', dropDown);
		
}(window._));