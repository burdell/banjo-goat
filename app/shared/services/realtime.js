(function(_) {
	'use strict';
	
	var realTime = function($q, nodeService){
		var defaultInterval = 10000;
		var polls = {};


		return {
			start: function(name, pollFn, interval, callback) {
				if (!polls[name]) {
					var poller = function(){
					var pollResult = pollFn();
					if (callback) {
							pollResult.then(callback);
						}
					};

					polls[name] = (setInterval(poller, interval || defaultInterval));
				}
			}
		};
	};
	realTime.$inject = [];

	angular.module('community.services')
		.factory('CommunityRealtimeService', realTime);

}(window._));