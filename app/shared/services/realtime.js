(function(_) {
	'use strict';
	
	var realTime = function($q, nodeService){
		var defaultInterval = 10000;

		function RealTimeService() {
			var poll = null;
			
			return  {
				start: function(pollFn, interval, callback) {
					if (!poll) {
						var poller = function(){
							pollFn();
						};

						poll = (setInterval(poller, interval || defaultInterval));
					}
				},
				stop: function(){
					if (poll) {
						clearInterval(poll);
						poll = null;
					}
				}
			}
		};
		

		return {
			getNew: function(){
				return new RealTimeService();
			}
		}
	};
	realTime.$inject = [];

	angular.module('community.services')
		.factory('CommunityRealtimeService', realTime);

}(window._));