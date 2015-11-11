
'use strict';

var _ = require('underscore');
var moment = require('moment');

function datepicker() {

    var link = function(scope, element, attrs) {
        scope.datepicker.dateInput = element.find('input')[0];

        element.on('change', function(){
            scope.datepicker.setUtcDate(scope.datepicker.picker);
        });
    };

	var controller = function($scope) {
        var ctrl = this;

        var formatString = 'YYYY-MM-DDTHH:mm:ss';
        _.extend(ctrl, {
            pickerOptions: {
                
            },
            setUtcDate: function(pikaday){
                var actualValueBecausePikadayIsAnnoying = ctrl.dateInput.value;
                $scope.$apply(function(){
                    ctrl.ngModel = actualValueBecausePikadayIsAnnoying ? moment.utc(pikaday._d).format(formatString) : null;
                });

                if (this.onChange) {
                    $scope.$eval(this.onChange);
                }
            }
        });
	};
	controller.$inject = ['$scope'];

    var directive = {
        link: link,
        controller: controller,
        templateUrl: 'directives/datepicker/datepicker.html',
        controllerAs: 'datepicker',
        bindToController: true,
        restrict: 'E',
        replace: true,
        scope: {
            ngModel: '=',
            placeholder: '@',
            onChange: '&'
        }
    };
    return directive;
}

angular.module('community.directives')
	.directive('communityDatepicker', datepicker);
	
