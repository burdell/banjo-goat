
	'use strict';
	  
	var _ = require('underscore');

	function attachmentDisplay() {
		var controller = function() {
			var ctrl = this;
			ctrl.removeAttachment = function(index) {
				ctrl.ngModel.splice(index, 1);
			}
		};
		controller.$inject = [];

	    var directive = {
	        controller: controller,
	        controllerAs: 'attachmentdisplay',
	        templateUrl: 'directives/attachmentdisplay/attachmentdisplay.html',
	        bindToController: true,
	        restrict: 'E',
	        scope: {
	        	'ngModel': '=',
	        	'canRemove': '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityAttachmentDisplay', attachmentDisplay);
		

