(function(_){
	'use strict';
	
	function communityLocationSearch() {
		var link = function(scope, element, attrs) {	
			var autocomplete = new google.maps.places.Autocomplete(element[0], {
				types: ['(regions)']
			});
			google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);

			function onPlaceChanged(){
				var placeData = autocomplete.getPlace();
				scope.$apply(function(){
					scope.locationsearch.locationModel = {
						display: placeData.formatted_address,
						coordinates: {
							lat: placeData.geometry.location.lat(),
							lng: placeData.geometry.location.lng()
						}
					}
				});
			}

			$(element).keyup(function(){
				if (!this.value) {
					scope.$apply(function(){
						scope.locationsearch.locationModel = null;
					});
				}
			});
		};

		var controller = function($scope) {

		};
		controller.$inject = ['$scope'];

	    var directive = {
	        link: link,
	        controller: controller,
	        controllerAs: 'locationsearch',
	        bindToController: true,
	        restrict: 'A',
	        scope: {
	        	locationModel: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityLocationSearch', communityLocationSearch);
		
}(window._));