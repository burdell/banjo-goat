
'use strict';

var _ = require('underscore');

require('directives/loader/loader.js');


function communityController ($rootScope, loaderService, errorService){
	var ctrl = this;
	
	_.extend(ctrl, {
		loaderService: loaderService,
		toggleDiscussionsMenu: function(){
			$rootScope.$broadcast('megamenu:toggleDiscussions');
		},
		pageError: function(){
			return !errorService.pageError ? null : 'partials/errors/' + errorService.pageError + '.html';
		}
	});
	
}
communityController.$inject = ['$rootScope', require('services/loader.js'), require('services/error.js')];

angular.module('communityApp')
	.controller('BaseCommunityController', communityController);


