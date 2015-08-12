(function(_){
	'use strict';
	
	function communityPermissions(permissionsService, userService) {
		var link = function(scope, element, attrs) {
			var requestedPermissions = null;

			if (attrs.communityPermissions) {
				var splitPermissions = attrs.communityPermissions.split(',');
				requestedPermissions = _.map(splitPermissions, function(permission){
					return permission.replace(/ /g, '');
				});
			}

			userService.get().then(function(user){
				var hasPermission = permissionsService.hasPermission(requestedPermissions, user);
				if (!hasPermission) {
					if (attrs.deniedBehavior === 'disable') {
						disableElement()
					} else {
						hideElement()
					}
				}
			});

			function hideElement() {
				element[0].style.display = 'none';
			}

			function disableElement() {
				var disabledElement = element.toString() === "[[object HTMLButtonElement]]" ? element : element.find('button');
				disabledElement.prop('disabled', 'disabled');
			}
		};

	    var directive = {
	        link: link,
	        bindToController: true,
	        restrict: 'A'
	    };
	    return directive;
	}
	communityPermissions.$inject = ['CommunityPermissionsService', 'CurrentUserService'];


	angular.module('community.directives')
		.directive('communityPermissions', communityPermissions);
		
}(window._));