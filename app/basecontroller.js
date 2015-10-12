
'use strict';

var _ = require('underscore');

require('services/loader.js');
require('directives/loader/loader.js');


function communityController (loaderService){
	var ctrl = this;
	
	_.extend(ctrl, {
		loaderService: loaderService
	});
	
}
communityController.$inject = ['CommunityLoaderService'];

angular.module('communityApp')
	.controller('BaseCommunityController', communityController);


