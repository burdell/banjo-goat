
//vendor
require('angular');
require('angular-ui-router');
require('angular-ui-select/select.js');
require('angular-sanitize');
// require('Sortable/Sortable.js');
// require('Sortable/ng-sortable');

function initializeApp(areaName) {
    var baseTag = document.createElement('base');
    baseTag.setAttribute('href', '/');
    document.head.appendChild(baseTag);
    
    var moduleBuilder = require('modulebuilder');

    angular.module('communityApp', [
        'ui.router',
        'ui.select',
        'ngSanitize',
        //'ng-sortable',
        'community.templates',
        moduleBuilder('community.providers'),
        moduleBuilder('community.services'),
        moduleBuilder('community.directives'),
        moduleBuilder('community.filters'),
        moduleBuilder('community.' + areaName)
    ]).run(['$anchorScroll', '$interpolate', '$rootScope', '$window', require('services/pagetitle.js'), 'CommunityNodeService', function($anchorScroll, $interpolate, $rootScope, $window, titleService, nodeServiceWrapper){
        $rootScope.$on('$stateChangeStart', function(event, newState, stateParams){
         //   $window.scrollTo(0,0);

            nodeServiceWrapper.get().then(function(nodeService){
                var nodeId = stateParams.nodeId || -1;
                var title = newState.title ? $interpolate(newState.title)(stateParams) : nodeService.getNode(nodeId).description;
                titleService.setTitle(title, true);
            });
        });

       // $anchorScroll.yOffset = 45;

    }]);

    //core stuff
    require('directives/mainnavbar/mainnavbar.js');
    require('directives/breadcrumbs/breadcrumbs.js');
    require('directives/discussionsnavbar/discussionsnavbar.js');
    require('directives/megamenu/megamenu.js');
    require('directives/pageheader/pageheader.js');
    require('directives/pagescroll/pagescroll.js');
    
    require('basecontroller.js');

    angular.element(document).ready(function(){
        angular.bootstrap(document, ['communityApp']);
    });
}

module.exports = initializeApp;

