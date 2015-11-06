
	'use strict';

	var _ = require('underscore');
	var moment = require('moment');

	var realTime = function($q, nodeService){
		var defaultInterval = 10000;

		function RealTimeService() {
			var poll = null;
			var lastResultTotal = null;
			var lastTimestamp = getTimestamp();
			
			var formatString = 'YYYY-MM-DDTHH:mm:ss';
			function getTimestamp(){
				return moment.utc().format('YYYY-MM-DDTHH:mm:ss');
			}

			return  {
				start: function(pollFn, callImmediately, callback, initial) {
					if (!poll) {
						var poller = function(applyTimestamp, initialData){
							if (_.isUndefined(applyTimestamp)) {
								applyTimestamp = true;
							}

							var since = undefined;
							if (applyTimestamp) {
								since = lastTimestamp
							} else if (initialData && initialData.since) {
								since = moment.utc(initialData.since).format(formatString);
							}
							
							var callModel = {
								page: undefined,
								size: (initialData && initialData.size) || undefined,
								since: since
							};

							var pollPromise = pollFn(callModel);
							if (callback) {
								pollPromise.then(callback)
							}
						};

						if (callImmediately) {
							poller(false, initial);
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
			},
		}
	};
	realTime.$inject = [];

	var serviceName = 'CommunityRealtimeService';
	angular.module('community.services')
		.factory(serviceName, realTime);
	module.exports = serviceName;

