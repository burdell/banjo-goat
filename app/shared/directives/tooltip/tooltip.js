(function($, _){
	'use strict';
	
	function communityTooltip() {
		var link = function(scope, element, attrs) {			
			$(element).tooltipster({
				contentAsHtml: true,
				content: 'Loading...',
				position: 'top-left',
				interactiveTolerance: '550',
				onlyOne: 'true',
				theme: 'cmuTooltipster',
				interactive: true,
				updateAnimation: false,
				functionBefore: function(origin, continueTooltip) {
					continueTooltip();

					if (origin.data('ajax') !== 'cached') {
						scope.tooltip.ajaxPopulate(scope.tooltip.idField).then(function(result){
							var content = result.model;
							var tooltipData = _.extend(content, {
								text: angular.element(content.body).text()
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
				
				if (this.localData) {
					templateData = _.extend(templateData, this.localData);
				}
				
				return $interpolate(tooltipTemplate)(templateData);
			};
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
	        	tooltipTemplateName: '@tooltipTemplate',
	        	localData: '='
	        }
	    };

	    return directive;
	}

	angular.module('community.directives')
		.directive('communityTooltip', communityTooltip);
		
}(window.jQuery, window._));