(function($){
	'use strict';
	
	function communityTooltip() {
		var link = function(scope, element, attrs) {			
			$(element).tooltipster({
				contentAsHtml: true,
				content: 'Loading...',
				position: 'bottom-left',
				minWidth: 100,
				maxWidth: 1200,
				interactive: true,
				updateAnimation: false,
				functionBefore: function(origin, continueTooltip) {
					continueTooltip();

					if (origin.data('ajax') !== 'cached') {
						scope.tooltip.ajaxPopulate(scope.tooltip.idField).then(function(result){
							var tooltipData = _.extend(result.content, {
								text: angular.element(result.content.body).text()
							});
							var tooltipElement = angular.element(scope.tooltip.getTemplate(tooltipData));
							origin.tooltipster('content', tooltipElement).data('ajax', 'cached');
						});
					}
				}
			});
		};

		var controller = function($templateCache, $interpolate) {
			this.getTemplate = function(templateData) {
				var tooltipTemplate = $templateCache.get(this.tooltipTemplateName);
				return $interpolate(tooltipTemplate)(templateData);
			}
		};

		controller.$inject = ['$templateCache', '$interpolate'];

	    var directive = {
	        link: link,
	        controller: controller,
	        controllerAs: 'tooltip',
	        bindToController: true,
	        restrict: 'AE',
	        scope: {
	        	ajaxPopulate: '=',
	        	idField: '@',
	        	tooltipTemplateName: '@tooltipTemplate'
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityTooltip', communityTooltip);
		
}(window.jQuery));