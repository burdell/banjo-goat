
'use strict';

var _ = require('underscore');

function communityAnnouncement() {
	var controller = function($scope) {
		var ctrl = this;

		_.extend(ctrl, {
            isOpen: true,
			closeMenu: function() {
				ctrl.isOpen = false;
				console.log('cloooose');
			}
		}); 
	};
	controller.$inject = ['$scope'];

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







// (function(_){
// 	'use strict';

// 	function communityAnnouncement() {
// 		function link(scope, element, attrs) {
		    
// 		}

// 		function controller(nodeService) {
		
// 		}
// 		controller.$inject = [];
	    
// 	    var directive = {
// 	        link: link,
// 	        controller: controller,
// 	        templateUrl: 'directives/announcement/announcement.html',
// 	        restrict: 'E',
// 	        controllerAs: 'announcement',
// 	        bindToController: true,
// 	        replace: true,
// 	        scope: {}
// 	    };

// 	    return directive;
// 	}

// 	angular.module('community.directives')
// 		.directive('communityAnnouncement', communityAnnouncement);

// }(window._));