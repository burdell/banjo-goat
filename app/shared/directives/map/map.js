(function(_){
	'use strict';
	
	function communityMap() {
		var link = function(scope, element, attrs) {
			var coordinates = scope.map.mapCoordinates;	
			var mapOptions = {
			    zoom: 4,
			    center: new google.maps.LatLng(coordinates.lat, coordinates.lng),
			    mapTypeId: google.maps.MapTypeId.TERRAIN
			}
			var mapElement = $(element).find('.map-canvas')[0];
			scope.map.mapInstance = new google.maps.Map(mapElement, mapOptions);
		};

		var controller = function($scope) {
			var ctrl = this;

			function setMapCoordinates() {
				var mapInstance = ctrl.mapInstance;
				var coordinates = ctrl.mapCoordinates;
				mapInstance.setCenter(new google.maps.LatLng(coordinates.lat, coordinates.lng))
			}

			$scope.$watch('map.mapCoordinates', function(newVal, oldVal){
				if (newVal != oldVal) {
					setMapCoordinates();
				}
			});

		};
		controller.$inject = ['$scope'];

	    var directive = {
	        link: link,
	        controller: controller,
	        controllerAs: 'map',
	        templateUrl: 'directives/map/map.html',
	        bindToController: true,
	        restrict: 'E',
	        replace: true,
	        scope: {
	        	mapCoordinates: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityMap', communityMap);
		
}(window._));
