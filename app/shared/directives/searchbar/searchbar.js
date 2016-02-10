
	'use strict';

	require('directives/keypress/enter.js');

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

		var controller = function($location, $rootScope, $scope, $state, routingService, utils) {
			var ctrl = this;

			$scope.$on('searchbar:' + ctrl.openEvent, function(){
				ctrl.toggleMenu();
			});

			$scope.$on('$stateChangeStart', function(){
				ctrl.isOpen = false;
			});

			$rootScope.$on('rootScope:closeAllDropdowns', function(){
				$scope.$emit('rootScope:closeSearchbar');
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
						$scope.$emit('rootScope:openSearchbar');
					} else {
						$scope.$emit('rootScope:closeSearchbar');
					}
				},
				search: function(){
					var currentArea = routingService.getCurrentArea();
					var searchModel = { q: ctrl.searchText };
					
					if (currentArea === 'directory') {
						$location.search(searchModel);
						$state.go('searchpage', searchModel);
					} else {
						window.location = (routingService.generateUrl('searchpage', null, searchModel ));
					}
				}
			});
		};
		controller.$inject = ['$location', '$rootScope', '$scope', '$state', require('services/routing.js'), require('services/utils.js')];

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
		
