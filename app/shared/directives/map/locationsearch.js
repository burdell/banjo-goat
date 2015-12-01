
'use strict';

var $ = require('jquery');
var mapsLoader = require('google-maps');
mapsLoader.LIBRARIES = ['places'];

function communityLocationSearch() {
	var link = function(scope, element, attrs) {	
		var ctrlModel = scope.locationsearch;

		if (ctrlModel.locationModel.locName) {
			element[0].value = ctrlModel.locationModel.locName;
		}

		var autocomplete = null;
		mapsLoader.load(function(google){
			autocomplete = new google.maps.places.Autocomplete(element[0], { types: ['(regions)'] });
			google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);
		});
	
		function onPlaceChanged(){
			var placeData = autocomplete.getPlace();
			scope.$apply(function(){
				ctrlModel.locationModel = {
					locName: placeData.formatted_address,
					locLat: placeData.geometry.location.lat(),
					locLon: placeData.geometry.location.lng()
				}
			});
		}

		$(element).keyup(function(){
			if (!this.value) {
				scope.$apply(function(){
					ctrlModel.locationModel = null;
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
	

