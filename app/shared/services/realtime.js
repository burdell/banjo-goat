(function(_) {
	'use strict';
	
	var realTime = function($q, nodeService){
		var defaultInterval = 10000;

		function RealTimeService() {
			var poll = null;
			var lastResultTotal = null;
			var updates = [];
			
			return  {
				start: function(pollFn, callImmediately, callback) {
					if (!poll) {
						var poller = function(){
							pollFn().then(function(result){
								updates = (lastResultTotal && (lastResultTotal < result.totalElements)) ? _.first(result.content, result.totalElements - lastResultTotal) : [];
								if (callback) {
									callback(result, updates);
								}
								lastResultTotal = result.totalElements;
							});
							
						};

						if (callImmediately) {
							poller();
						}

						poll = setInterval(poller, defaultInterval);
					}
				},
				stop: function(){
					if (poll) {
						clearInterval(poll);
						poll = null;
					}
				},
				getUpdates: function(){
					return updates;
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