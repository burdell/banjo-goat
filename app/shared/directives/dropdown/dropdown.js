
	'use strict';

	require('services/utils.js');

	var _ = require('underscore');
	
	function dropDown() {
		var controller = function($rootScope, $scope, utils) {
			var ctrl = this;

			$scope.$on('dropdown:' + ctrl.openEvent, function(){
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
	        	templateCtrl: '='
	        }
	    };
	    return directive;
	}

	angular.module('community.directives')
		.directive('communityDropDown', dropDown);
		
