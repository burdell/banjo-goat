
	'use strict';

	var _ = require('underscore');
	var moment = require('moment');

	var realTime = function($q, nodeService){
		var defaultInterval = 10000;

		function RealTimeService() {
			var poll = null;
			var lastResultTotal = null;
			var lastTimestamp = getTimestamp();
			
			function getTimestamp(){
				return moment.utc().format('YYYY-MM-DDTHH:mm:ss');
			}

			return  {
				start: function(pollFn, callImmediately, callback) {
					if (!poll) {
						var poller = function(applyTimestamp){
							if (_.isUndefined(applyTimestamp)) {
								applyTimestamp = true;
							}

							var callModel = {
								page: undefined,
								size: undefined,
								since: applyTimestamp ? lastTimestamp : undefined
							};
							
							pollFn(callModel);
						};

						if (callImmediately) {
							poller(false);
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
				resetTimestamp: function(){
					lastTimestamp = getTimestamp();
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

