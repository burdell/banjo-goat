
	'use strict';

	require('services/utils.js');
    require('shared/filters/numberLimit.js');

	var _ = require('underscore');
	
	function dropDown() {
		var controller = function($rootScope, $scope, utils) {
			var ctrl = this;

			$scope.$on('$stateChangeStart', function(){
				ctrl.isOpen = false;
			});

			$rootScope.$on('rootScope:closeAllDropdowns', function(){
				ctrl.isOpen = false;
			});
			
			_.extend(ctrl, {
				isOpen: false,
				toggle: function(){
					if(!ctrl.isOpen) {
						$scope.$emit('rootScope:closeAllDropdowns');

						if (ctrl.onOpenFn) {
							ctrl.onOpenFn();
						}
					}

					ctrl.isOpen = !ctrl.isOpen;
				}
			});
		};
		controller.$inject = ['$rootScope', '$scope', 'CommunityUtilsService'];

	    var directive = {
	        controller: controller,
	        templateUrl: 'directives/dropdown/dropdown.html',
	        controllerAs: 'dropdown',
	        bindToController: true,
	        restrict: 'E',
	        scope: {
	        	openEvent: '@',
	        	menuTemplateUrl: '@',
	        	templateCtrl: '=',
	        	elementClassname: '@',
	        	iconClassname: '@',
	        	label: '@',
	        	onOpenFn: '='
	        }
	    };
	    return directive;
	}

	angular.module('community.directives')
		.directive('communityDropDown', dropDown);
		
