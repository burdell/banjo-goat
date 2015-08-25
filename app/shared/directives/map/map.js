(function(_){
	'use strict';
	
	function communityMap() {
		var link = function(scope, element, attrs) {
			var coordinates = scope.map.mapCoordinates;	
			var latLng = new google.maps.LatLng(coordinates.lat, coordinates.lng);
			var mapOptions = {
			    zoom: 4,
			    center: latLng,
			    mapTypeId: google.maps.MapTypeId.TERRAIN,
			    streetViewControl: false,
			    mapTypeControl: false
			}
			var mapElement = $(element).find('.map-canvas')[0];
			scope.map.mapInstance = new google.maps.Map(mapElement, mapOptions);
			scope.map.setMarker(latLng);
		};

		var controller = function($scope) {
			var ctrl = this;

			_.extend(ctrl, {
				setMarker: function(latLng){
					if (ctrl.marker) {
						ctrl.marker.setMap(null);
						ctrl.marker = null;
					}
					
					ctrl.marker = new google.maps.Marker({
						position: latLng,
						map: ctrl.mapInstance
					});
				}
			});

			function setMapCoordinates() {
				var mapInstance = ctrl.mapInstance;
				var coordinates = ctrl.mapCoordinates;

				var latLng = new google.maps.LatLng(coordinates.lat, coordinates.lng);

				mapInstance.setCenter(latLng);
				ctrl.setMarker(latLng);
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
