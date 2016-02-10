
'use strict';

require('services/api.js');
require('services/realtime.js');

var _ = require('underscore');


function pulse() {
	
	var controller = function($scope, $stateParams, communityApi, realtimeService) {
		var ctrl = this;

        var realtime = realtimeService.getNew();

        realtime.start(function(){
            communityApi.Core.pulse($stateParams.nodeId).then(function(result){

                if(!_.isEqual(ctrl.stats, result)) {
                    // add an update animation class
                }

                _.extend(ctrl.stats, result);
            })
        }, true);

        $scope.$on('$destroy', function(){
            realtime.stop();
        });
        
		_.extend(ctrl, {
			stats: {
                onlineCount: null,
                postCount: null,
                recentPostCount: null,
                userCount: null
            }
		});
	};
	controller.$inject = ['$scope', '$stateParams', 'CommunityApiService', 'CommunityRealtimeService'];

    var directive = {
        controller: controller,
        controllerAs: 'pulse',
        templateUrl: 'directives/pulse/pulse.html',
        bindToController: true,
        restrict: 'E',
        replace: true,
        scope: {
         
        }
    };

    return directive;
}

angular.module('community.directives')
	.directive('communityPulse', pulse);
	

