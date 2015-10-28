
'use strict';

var _ = require('underscore');

require('services/loader.js');
require('directives/loader/loader.js');


function communityController ($rootScope, loaderService){
	var ctrl = this;
	
	_.extend(ctrl, {
		loaderService: loaderService,
		toggleDiscussionsMenu: function(){
			$rootScope.$broadcast('megamenu:toggleDiscussions');
		}
	});
	
}
communityController.$inject = ['$rootScope', 'CommunityLoaderService'];

angular.module('communityApp')
	.controller('BaseCommunityController', communityController);


