
'use strict';

require('directives/breadcrumbs/breadcrumbs.js');
require('directives/discussionsheader/discussionsheader.js');
require('directives/discussionsnavbar/discussionsnavbar.js');

require('services/loader.js');

var _ = require('underscore');


function pageHeader() {
	var controller = function(loaderService) {
		var ctrl = this;

        loaderService.showBaseLoader = false;
		_.extend(ctrl, {
		});
	};
	controller.$inject = ['CommunityLoaderService'];

    var directive = {
        controller: controller,
        templateUrl: 'directives/pageheader/pageheader.html',
        controllerAs: 'pageheader',
        bindToController: true,
        replace: 'true',
        restrict: 'E',
        scope: {
            headerText: '@',
            hideElementSelector: '@'
        }
    };
    return directive;
}

angular.module('community.directives')
	.directive('communityPageHeader', pageHeader);
	
