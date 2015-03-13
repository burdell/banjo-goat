(function(){
	'use strict';

	function {{ DIRECTIVE_NAME }} () {
		function link(scope, element, attrs) {
		    
		}

	    var directive = {
	        link: link,
	        templateUrl: {{ DIRECTIVE_TEMPLATE }},
	        restrict: 'EA',
	        scope: true
	    };

	    return directive;
	}

	angular.module({{ DIRECTIVE_MODULE }})
		.directive({{ DIRECTIVE_NAME }}, {{ directiveName }});
}());