
	'use strict';

	require('services/utils.js');

	var _ = require('underscore');
	var $ = require('jquery');
	
	function searchBar($timeout) {
		function link(scope, element) {
			var $element = $(element).find('input');
			
			scope.searchbar.focus = function(){
				$timeout(function(){
					$element.focus();
				}, 0);
			}
		};

		var controller = function($rootScope, $scope, utils) {
			var ctrl = this;

			$scope.$on('searchbar:' + ctrl.openEvent, function(){
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
					
					if (ctrl.isOpen) {
						ctrl.focus();
					}
				}
			});
		};
		controller.$inject = ['$rootScope', '$scope', 'CommunityUtilsService'];

	    var directive = {
	    	link: link,
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
	searchBar.$inject = ['$timeout']

	angular.module('community.directives')
		.directive('communitySearchBar', searchBar);
		
