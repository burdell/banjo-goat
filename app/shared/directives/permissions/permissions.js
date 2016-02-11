
	'use strict';

	var _ = require('underscore');
	
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
				var hasPermission = permissionsService.hasPermission(requestedPermissions, user, Number(scope.permissionsId));
				if (!hasPermission) {
					var deniedBehavior = attrs.deniedBehavior;
					if (deniedBehavior === 'hide') {
						hideElement();
					} else if (deniedBehavior === 'addClass'){
						addClass(attrs.deniedClass);
					}else {
						disableElement();
					}
				}
			});

			function addClass(className){
				if (!className) {
					className = 'notLoggedIn';
				}
				element[0].classList.add(className);
			}

			function hideElement() {
				// jan: experimenting with adding a "disabled" container class
				 element[0].style.display = 'none';
				//element[0].setAttribute("class", "cmuDisabled " + element[0].getAttribute("class") );
			}

			function disableElement() {
				var disabledElement = element.toString() === "[[object HTMLButtonElement]]" ? element : element.find('button');
				disabledElement.prop('disabled', 'disabled');
			}
		};

	    var directive = {
	        link: link,
	        bindToController: true,
	        restrict: 'A',
	        scope: {
	        	permissionsId: '='
	        }
	    };
	    return directive;
	}
	communityPermissions.$inject = [require('services/permissions.js'), require('services/currentuser.js')];


	angular.module('community.directives')
		.directive('communityPermissions', communityPermissions);
		
