
//vendor
require('angular');
require('angular-ui-router');
require('angular-ui-select/select.js');
require('angular-sanitize');
require('pikaday-angular');
require('angular-cookies');

// require('Sortable/Sortable.js');
// require('Sortable/ng-sortable');

function initializeApp(areaName) {
    var baseTag = document.createElement('base');
    baseTag.setAttribute('href', '/');
    document.head.appendChild(baseTag);
    document.cookie = "COMM_AUTH=3";

    var moduleBuilder = require('modulebuilder');

    angular.module('communityApp', [
        'ui.router',
        'ui.select',
        'ngSanitize',
        // 'ng-sortable',
        'ngCookies',
        'community.templates',
        'pikaday',
        moduleBuilder('community.providers'),
        moduleBuilder('community.services'),
        moduleBuilder('community.directives'),
        moduleBuilder('community.filters'),
        moduleBuilder('community.' + areaName)
    ])    
    .config(['$httpProvider', function($httpProvider){
        $httpProvider.interceptors.push('CommunityPermissionsInterceptor');
    }])
    .run(['$anchorScroll', '$interpolate', '$rootScope', '$window', require('services/pagetitle.js'), 'CommunityNodeService', function($anchorScroll, $interpolate, $rootScope, $window, titleService, nodeServiceWrapper){
        $rootScope.$on('$stateChangeStart', function(event, newState, stateParams){
            $window.scrollTo(0,0);

            nodeServiceWrapper.get().then(function(nodeService){
                var nodeId = stateParams.nodeId || -1;
                var title = newState.title ? $interpolate(newState.title)(stateParams) : nodeService.getNode(nodeId).description;
                titleService.setTitle(title, true);
            });
        });

        $anchorScroll.yOffset = 45;

    }]);

    //core stuff
    require('services/permissionsLoader.js');
    
    require('directives/mainnavbar/mainnavbar.js');
    require('directives/breadcrumbs/breadcrumbs.js');
    require('directives/discussionsnavbar/discussionsnavbar.js');
    require('directives/megamenu/megamenu.js');
    require('directives/pageheader/pageheader.js');
    require('directives/announcement/announcement.js');
    require('directives/pagescroll/pagescroll.js');
    require('directives/permissions/permissions.js');
    require('directives/error/error.js');
    
    require('basecontroller.js');

    angular.element(document).ready(function(){
        angular.bootstrap(document, ['communityApp']);
    });
}

module.exports = initializeApp;

