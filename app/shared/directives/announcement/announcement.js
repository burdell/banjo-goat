
'use strict';

var _ = require('underscore');

function communityAnnouncement() {
	var controller = function($cookies, $cookieStore) {
		var ctrl = this;

  		ctrl.isOpen = true;
        if ($cookieStore.get('introBannerIsOpen') === 'false') { ctrl.isOpen = false; }

		_.extend(ctrl, {
			closeMenu: function() {
				ctrl.isOpen = false;
				$cookieStore.put('introBannerIsOpen','false');
				console.log('cloooose');
			}
		}); 
	};
	controller.$inject = ['$cookies', '$cookieStore'];

    var directive = {
        controller: controller,
        templateUrl: 'directives/announcement/announcement.html',
        controllerAs: 'announcement',
        bindToController: true,
        replace: true,
        restrict: 'E',
        scope: { }
    };
    return directive;
}


angular.module('community.directives')
	.directive('communityAnnouncement', communityAnnouncement);

