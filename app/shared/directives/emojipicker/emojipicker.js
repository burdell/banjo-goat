
'use strict';

var $ = require('jquery');
require('directives/emojipicker/vendor/js/jquery.emojipicker.js')($);
require('directives/emojipicker/vendor/js/jquery.emojipicker.a.js')($);


function emojipicker() {

    var link = function(scope, element, attrs) {
        var emojiInput = $(element).find('.emojiPicker-input');

        var emojiPicker = emojiInput.emojiPicker();
        emojiInput.width(0);

        emojiInput.keyup(function(event, selectedData){
            scope.emojipicker.onSelect(selectedData);
        });
    };

	var controller = function($scope) {
        var ctrl = this;
	};
	controller.$inject = ['$scope'];

    var directive = {
        link: link,
        controller: controller,
        templateUrl: 'directives/emojipicker/emojipicker.html',
        controllerAs: 'emojipicker',
        bindToController: true,
        restrict: 'E',
        replace: true,
        scope: {
            onSelect: '='
        }
    };
    return directive;
}

angular.module('community.directives')
	.directive('communityEmojiPicker', emojipicker);
	
