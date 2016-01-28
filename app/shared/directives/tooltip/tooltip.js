
'use strict';

var $ = require('jquery');
//tooltip plugin needs this
window.jQuery = $;
require('tooltipster');

var _ = require('underscore');

function communityTooltip() {
	var link = function(scope, element, attrs) {			
		$(element).tooltipster({
			contentAsHtml: true,
			content: '<div class="cmuLoader__container cmuLoader__container--small cmuLoader__container--tight"><div class="cmuLoader"><span></span></div></div>',
			position: 'bottom',
			position: scope.tooltip.position,
			interactiveTolerance: '550',
			onlyOne: 'true',
			interactive: false,
			updateAnimation: false,
			theme: scope.tooltip.tooltipClass,
			functionBefore: function(origin, continueTooltip) {
				continueTooltip();

				if (typeof(scope.tooltip.textData) == 'undefined') {

					if (origin.data('ajax') !== 'cached') {
						scope.tooltip.ajaxPopulate(scope.tooltip.idField).then(function(result){
							console.log('tooltip.js content returned:')
							console.log(result)

							if (typeof(result.message) !== 'undefined') {
								// thread message object
								console.log(result.message)
								var content = result.message;

								var tooltipText = $('<div>' + content.body + '</div>').text();
								if (tooltipText === "") {
									tooltipText = "<strong>" + scope.tooltip.emptyText + "</strong>";
								}

								var tooltipData = _.extend(content, {
									text: tooltipText
								});

								var tooltipElement = angular.element(scope.tooltip.getTemplate(tooltipData));
								origin.tooltipster('content', tooltipElement).data('ajax', 'cached');
							} else if (typeof(result.login) !== 'undefined') {
								// user object
								var tooltipData = { user: result }

								var tooltipElement = angular.element(scope.tooltip.getTemplate(tooltipData));
								origin.tooltipster('content', tooltipElement).data('ajax', 'cached');
							}
						});
					}

				} else if (typeof(scope.tooltip.textData) !== 'undefined') {
					origin.tooltipster('content', scope.tooltip.textData).data('ajax', 'cached');
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
        	emptyText: '@',
        	idField: '@',
        	localData: '=',
        	contentData: '@',
        	textData: '@',
        	tooltipClass: '@',
        	position: '@',
        	tooltipTemplateName: '@tooltipTemplate'
        }
    };

    return directive;
}

angular.module('community.directives')
	.directive('communityTooltip', communityTooltip);
	
