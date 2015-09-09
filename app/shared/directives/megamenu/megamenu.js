(function(_){
	'use strict';
	
	function megaMenu() {
		var controller = function($scope, utils) {
			var ctrl = this;

			$scope.$on('megamenu:' + ctrl.openEvent, function(){
				ctrl.toggleMenu();
			});

			$scope.$on('$stateChangeStart', function(){
				ctrl.isOpen = false;
			});

			_.extend(ctrl, {
				isOpen: false,
				toggleMenu: function(){
					ctrl.isOpen = !ctrl.isOpen;
					utils.preventBodyScroll(ctrl.isOpen);
				}
			});
		};
		controller.$inject = ['$scope', 'CommunityUtilsService'];

	    var directive = {
	        controller: controller,
	        templateUrl: 'directives/megamenu/megamenu.html',
	        controllerAs: 'megamenu',
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
		.directive('communityMegaMenu', megaMenu);
		
}(window._));