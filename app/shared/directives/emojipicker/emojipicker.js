
'use strict';

var $ = require('jquery');
require('directives/emojipicker/vendor/js/jquery.emojipicker.js')($);
require('directives/emojipicker/vendor/js/jquery.emojipicker.a.js')($);


function emojipicker() {

    var cb = function() {
        var l = document.createElement('link'); l.rel = 'stylesheet';
        l.href = 'http://comm-cdn.ubnt.com/cmuEmoji.css';
        var h = document.getElementsByTagName('head')[0]; h.parentNode.insertBefore(l, h);
    };
    var raf = requestAnimationFrame || mozRequestAnimationFrame ||
    webkitRequestAnimationFrame || msRequestAnimationFrame;
    if (raf) raf(cb);
    else window.addEventListener('load', cb);


    var link = function(scope, element, attrs) {
        var emojiInput = $(element).find('.emojiPicker-input');

        var emojiCtrl = scope.emojipicker;

        var emojiPicker;
        if (emojiCtrl.fixedtobottom) {
            emojiPicker = emojiInput.emojiPicker({
                                                    width:'300px',
                                                    height: '80px',
                                                    container: '.cmuTextEditor__floatContainer',
                                                });
        } else {
            emojiPicker = emojiInput.emojiPicker();
        }
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
            fixedtobottom: '=',
            onSelect: '='
        }
    };
    return directive;
}

angular.module('community.directives')
	.directive('communityEmojiPicker', emojipicker);
	
