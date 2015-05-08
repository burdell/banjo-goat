(function(){
	'use strict';
	
	var baseTag = document.createElement('base');
	baseTag.setAttribute('href', '/');
	document.head.appendChild(baseTag);
	
	angular.module('communityApp', [
		'ui.router',
		'community.services',
        'community.directives', 
        'community.filters',  
		'community.templates',
        'community.{{GULP_BUILD_areaName}}', 
	]).run(['$rootScope', '$window', 'CurrentUserService', function($rootScope, $window, currentUser){
        $rootScope.$on('$stateChangeSuccess', function(){
            $window.scrollTo(0,0);
        })

        //MOCKED
        currentUser.set({
            id: 259,
            avatar: {
                height: 0,
                url: null,
                width: 0
            },
            href: '/users/259',
            login: 'UBNT-Matt',
            rank: 'authorRank',
            stats: []
        });
    }]);

	angular.element(document).ready(function(){
		angular.bootstrap(document, ['communityApp']);
	});

}());


window.nodeStructure = [
  {
    "name": "Community",
    "id": -1,
    "urlSlug": "root",
    "href": "/api/nodes/root/",
    "children": [
      {
        "name": "Products",
        "id": 75,
        "urlSlug": "products",
        "href": "/api/nodes/products/",
        "children": [
          {
            "name": "airMAX",
            "id": 77,
            "urlSlug": "airMAX",
            "href": "/api/nodes/airMax/",
            "children": [
              {
                "name": "airMAX Alpha",
                "id": 1004,
                "urlSlug": "airMAX_a",
                "href": "/api/nodes/airMAX_a/",
                "children": [ ]
              }, {
                "name": "airMAX Beta",
                "id": 1005,
                "urlSlug": "airMAX_b",
                "href": "/api/nodes/airMAX_b/",
                "children": [ ]
              }, {
                "name": "airMAX General",
                "id": 1006,
                "urlSlug": "airMAX_g",
                "href": "/api/nodes/airMAX_g/",
                "children": [ ]
              }, {
                "name": "airMAX Stories",
                "id": 396,
                "urlSlug": "airMAX_Stories",
                "href": "/api/nodes/airMAX_Stories/",
                "children": [ ]
              }, {
                "name": "airMAX Q&A",
                "id": 1007,
                "urlSlug": "airMAX_QnA",
                "href": "/api/nodes/airMAX_QnA/",
                "children": [ ]
              }, {
                "name": "airMAX Announcements",
                "id": 1008,
                "urlSlug": "airMAX_Annoucements",
                "href": "/api/nodes/airMAX_Annoucements/",
                "children": [ ]
              }, {
                "name": "airMAX Feature Requests",
                "id": 81,
                "urlSlug": "airMAX_Features",
                "href": "/api/nodes/airMAX_Features/",
                "children": [ ]
              }, {
                "name": "airMAX Bug Tracker",
                "id": 1009,
                "urlSlug": "airMAX_Bugs",
                "href": "/api/nodes/airMAX_Bugs/",
                "children": [ ]
              }
            ]
          },




          {
            "name": "UniFi",
            "id": 91,
            "urlSlug": "UniFi",
            "href": "/api/nodes/UniFi/",
            "children": [
              {
                "name": "UniFi Alpha",
                "id": 428,
                "urlSlug": "UniFi_a",
                "href": "/api/nodes/UniFi_a/",
                "children": [ ]
              }, {
                "name": "UniFi Beta",
                "id": 53,
                "urlSlug": "UniFi_b",
                "href": "/api/nodes/UniFi_b/",
                "children": [ ]
              }, {
                "name": "UniFi General",
                "id": 1011,
                "urlSlug": "UniFi_g",
                "href": "/api/nodes/UniFi_g/",
                "children": [ ]
              }, {
                "name": "UniFi Stories",
                "id": 384,
                "urlSlug": "UniFi_Stories",
                "href": "/api/nodes/UniFi_Stories/",
                "children": [ ]
              }, {
                "name": "UniFi Q&A",
                "id": 1012,
                "urlSlug": "UniFi_QnA",
                "href": "/api/nodes/UniFi_QnA/",
                "children": [ ]
              }, {
                "name": "UniFi Announcements",
                "id": 1013,
                "urlSlug": "UniFi_Annoucements",
                "href": "/api/nodes/UniFi_Annoucements/",
                "children": [ ]
              }, {
                "name": "UniFi Feature Requests",
                "id": 95,
                "urlSlug": "UniFi_Features",
                "href": "/api/nodes/UniFi_Features/",
                "children": [ ]
              }, {
                "name": "UniFi Bug Tracker",
                "id": 1014,
                "urlSlug": "UniFi_Bugs",
                "href": "/api/nodes/UniFi_Bugs/",
                "children": [ ]
              }
            ]
          },








          {
            "name": "UniFi Video",
            "id": 111,
            "urlSlug": "UniFiVideo",
            "href": "/api/nodes/UniFiVideo/",
            "children": [
              {
                "name": "UniFi Video Alpha",
                "id": 16,
                "urlSlug": "UniFiVideo_a",
                "href": "/api/nodes/UniFiVideo_a/",
                "children": [ ]
              }, {
                "name": "UniFi Video Beta",
                "id": 17,
                "urlSlug": "UniFiVideo_b",
                "href": "/api/nodes/UniFiVideo_b/",
                "children": [ ]
              }, {
                "name": "UniFi Video General",
                "id": 15,
                "urlSlug": "UniFiVideo_g",
                "href": "/api/nodes/UniFiVideo_g/",
                "children": [ ]
              }, {
                "name": "UniFi Video Stories",
                "id": 388,
                "urlSlug": "UniFiVideo_Stories",
                "href": "/api/nodes/UniFiVideo_Stories/",
                "children": [ ]
              }, {
                "name": "UniFi Video Q&A",
                "id": 1015,
                "urlSlug": "UniFiVideo_QnA",
                "href": "/api/nodes/UniFiVideo_QnA/",
                "children": [ ]
              }, {
                "name": "UniFi Video Announcements",
                "id": 1016,
                "urlSlug": "UniFiVideo_Annoucements",
                "href": "/api/nodes/UniFiVideo_Annoucements/",
                "children": [ ]
              }, {
                "name": "UniFi Video Feature Requests",
                "id": 401,
                "urlSlug": "UniFiVideo_Features",
                "href": "/api/nodes/UniFiVideo_Features/",
                "children": [ ]
              }, {
                "name": "UniFi Video Bug Tracker",
                "id": 1017,
                "urlSlug": "UniFiVideo_Bugs",
                "href": "/api/nodes/UniFiVideo_Bugs/",
                "children": [ ]
              }
            ]
          },




          {
            "name": "UniFi VoIP",
            "id": 1001,
            "urlSlug": "UniFiVoIP",
            "href": "/api/nodes/UniFiVoIP/",
            "children": [
              {
                "name": "UniFi VoIP Alpha",
                "id": 1018,
                "urlSlug": "UniFiVoIP_a",
                "href": "/api/nodes/UniFiVoIP_a/",
                "children": [ ]
              }, {
                "name": "UniFi VoIP Beta",
                "id": 473,
                "urlSlug": "UniFiVoIP_b",
                "href": "/api/nodes/UniFiVoIP_b/",
                "children": [ ]
              }, {
                "name": "UniFi VoIP General",
                "id": 471,
                "urlSlug": "UniFiVoIP_g",
                "href": "/api/nodes/UniFiVoIP_g/",
                "children": [ ]
              }, {
                "name": "UniFi VoIP Stories",
                "id": 1019,
                "urlSlug": "UniFiVoIP_Stories",
                "href": "/api/nodes/UniFiVoIP_Stories/",
                "children": [ ]
              }, {
                "name": "UniFi VoIP Q&A",
                "id": 1020,
                "urlSlug": "UniFiVoIP_QnA",
                "href": "/api/nodes/UniFiVoIP_QnA/",
                "children": [ ]
              }, {
                "name": "UniFi VoIP Announcements",
                "id": 1021,
                "urlSlug": "UniFiVoIP_Annoucements",
                "href": "/api/nodes/UniFiVoIP_Annoucements/",
                "children": [ ]
              }, {
                "name": "UniFi VoIP Feature Requests",
                "id": 441,
                "urlSlug": "UniFiVoIP_Features",
                "href": "/api/nodes/UniFiVoIP_Features/",
                "children": [ ]
              }, {
                "name": "UniFi VoIP Bug Tracker",
                "id": 1022,
                "urlSlug": "UniFiVoIP_Bugs",
                "href": "/api/nodes/UniFiVoIP_Bugs/",
                "children": [ ]
              }
            ]
          },






          {
            "name": "UniFi Routing and Switching",
            "id": 1002,
            "urlSlug": "UniFiRaS",
            "href": "/api/nodes/UniFiRaS/",
            "children": [
              {
                "name": "UniFi Routing and Switching Alpha",
                "id": 483,
                "urlSlug": "UniFiRaS_a",
                "href": "/api/nodes/UniFiRaS_a/",
                "children": [ ]
              }, {
                "name": "UniFi Routing and Switching Beta",
                "id": 1023,
                "urlSlug": "UniFiRaS_b",
                "href": "/api/nodes/UniFiRaS_b/",
                "children": [ ]
              }, {
                "name": "UniFi Routing and Switching General",
                "id": 461,
                "urlSlug": "UniFiRaS_g",
                "href": "/api/nodes/UniFiRaS_g/",
                "children": [ ]
              }, {
                "name": "UniFi Routing and Switching Stories",
                "id": 1024,
                "urlSlug": "UniFiRaS_Stories",
                "href": "/api/nodes/UniFiRaS_Stories/",
                "children": [ ]
              }, {
                "name": "UniFi Routing and Switching Q&A",
                "id": 1025,
                "urlSlug": "UniFiRaS_QnA",
                "href": "/api/nodes/UniFiRaS_QnA/",
                "children": [ ]
              }, {
                "name": "UniFi Routing and Switching Announcements",
                "id": 1026,
                "urlSlug": "UniFiRaS_Annoucements",
                "href": "/api/nodes/UniFiRaS_Annoucements/",
                "children": [ ]
              }, {
                "name": "UniFi Routing and Switching Feature Requests",
                "id": 1027,
                "urlSlug": "UniFiRaS_Features",
                "href": "/api/nodes/UniFiRaS_Features/",
                "children": [ ]
              }, {
                "name": "UniFi Routing and Switching Bug Tracker",
                "id": 1028,
                "urlSlug": "UniFiRaS_Bugs",
                "href": "/api/nodes/UniFiRaS_Bugs/",
                "children": [ ]
              }
            ]
          },





          {
            "name": "EdgeSwitch",
            "id": 1003,
            "urlSlug": "EdgeSwitch",
            "href": "/api/nodes/EdgeSwitch/",
            "children": [
              {
                "name": "EdgeSwitch Alpha",
                "id": 1029,
                "urlSlug": "EdgeSwitch_a",
                "href": "/api/nodes/EdgeSwitch_a/",
                "children": [ ]
              }, {
                "name": "EdgeSwitch Beta",
                "id": 1030,
                "urlSlug": "EdgeSwitch_b",
                "href": "/api/nodes/EdgeSwitch_b/",
                "children": [ ]
              }, {
                "name": "EdgeSwitch General",
                "id": 447,
                "urlSlug": "EdgeSwitch_g",
                "href": "/api/nodes/EdgeSwitch_g/",
                "children": [ ]
              }, {
                "name": "EdgeSwitch Stories",
                "id": 1031,
                "urlSlug": "EdgeSwitch_Stories",
                "href": "/api/nodes/EdgeSwitch_Stories/",
                "children": [ ]
              }, {
                "name": "EdgeSwitch Q&A",
                "id": 1032,
                "urlSlug": "EdgeSwitch_QnA",
                "href": "/api/nodes/EdgeSwitch_QnA/",
                "children": [ ]
              }, {
                "name": "EdgeSwitch Announcements",
                "id": 1033,
                "urlSlug": "EdgeSwitch_Annoucements",
                "href": "/api/nodes/EdgeSwitch_Annoucements/",
                "children": [ ]
              }, {
                "name": "EdgeSwitch Feature Requests",
                "id": 1034,
                "urlSlug": "EdgeSwitch_Features",
                "href": "/api/nodes/EdgeSwitch_Features/",
                "children": [ ]
              }, {
                "name": "EdgeSwitch Bug Tracker",
                "id": 1035,
                "urlSlug": "EdgeSwitch_Bugs",
                "href": "/api/nodes/EdgeSwitch_Bugs/",
                "children": [ ]
              }
            ]
          },





          {
            "name": "airCRM",
            "id": 1003,
            "urlSlug": "airCRM",
            "href": "/api/nodes/airCRM/",
            "children": [
              {
                "name": "airCRM Alpha",
                "id": 1036,
                "urlSlug": "airCRM_a",
                "href": "/api/nodes/airCRM_a/",
                "children": [ ]
              }, {
                "name": "airCRM Beta",
                "id": 1037,
                "urlSlug": "airCRM_b",
                "href": "/api/nodes/airCRM_b/",
                "children": [ ]
              }, {
                "name": "airCRM General",
                "id": 1038,
                "urlSlug": "airCRM_g",
                "href": "/api/nodes/airCRM_g/",
                "children": [ ]
              }, {
                "name": "airCRM Stories",
                "id": 1039,
                "urlSlug": "airCRM_Stories",
                "href": "/api/nodes/airCRM_Stories/",
                "children": [ ]
              }, {
                "name": "airCRM Q&A",
                "id": 1040,
                "urlSlug": "airCRM_QnA",
                "href": "/api/nodes/airCRM_QnA/",
                "children": [ ]
              }, {
                "name": "airCRM Announcements",
                "id": 1041,
                "urlSlug": "airCRM_Annoucements",
                "href": "/api/nodes/airCRM_Annoucements/",
                "children": [ ]
              }, {
                "name": "airCRM Feature Requests",
                "id": 1042,
                "urlSlug": "airCRM_Features",
                "href": "/api/nodes/airCRM_Features/",
                "children": [ ]
              }, {
                "name": "airCRM Bug Tracker",
                "id": 1043,
                "urlSlug": "airCRM_Bugs",
                "href": "/api/nodes/airCRM_Bugs/",
                "children": [ ]
              }
            ]
          },





          {
            "name": "EdgeMAX",
            "id": 101,
            "urlSlug": "EdgeMAX",
            "href": "/api/nodes/EdgeMAX/",
            "children": [
              {
                "name": "EdgeMAX Alpha",
                "id": 24,
                "urlSlug": "EdgeMAX_a",
                "href": "/api/nodes/EdgeMAX_a/",
                "children": [ ]
              }, {
                "name": "EdgeMAX Beta",
                "id": 1044,
                "urlSlug": "EdgeMAX_b",
                "href": "/api/nodes/EdgeMAX_b/",
                "children": [ ]
              }, {
                "name": "EdgeMAX General",
                "id": 22,
                "urlSlug": "EdgeMAX_g",
                "href": "/api/nodes/EdgeMAX_g/",
                "children": [ ]
              }, {
                "name": "EdgeMAX Stories",
                "id": 386,
                "urlSlug": "EdgeMAX_Stories",
                "href": "/api/nodes/EdgeMAX_Stories/",
                "children": [ ]
              }, {
                "name": "EdgeMAX Q&A",
                "id": 1045,
                "urlSlug": "EdgeMAX_QnA",
                "href": "/api/nodes/EdgeMAX_QnA/",
                "children": [ ]
              }, {
                "name": "EdgeMAX Announcements",
                "id": 163,
                "urlSlug": "EdgeMAX_Annoucements",
                "href": "/api/nodes/EdgeMAX_Annoucements/",
                "children": [ ]
              }, {
                "name": "EdgeMAX Feature Requests",
                "id": 403,
                "urlSlug": "EdgeMAX_Features",
                "href": "/api/nodes/EdgeMAX_Features/",
                "children": [ ]
              }, {
                "name": "EdgeMAX Bug Tracker",
                "id": 18,
                "urlSlug": "EdgeMAX_Bugs",
                "href": "/api/nodes/EdgeMAX_Bugs/",
                "children": [ ]
              }
            ]
          },





          {
            "name": "mFi",
            "id": 115,
            "urlSlug": "mFi",
            "href": "/api/nodes/mFi/",
            "children": [
              {
                "name": "mFi Alpha",
                "id": 1046,
                "urlSlug": "mFi_a",
                "href": "/api/nodes/mFi_a/",
                "children": [ ]
              }, {
                "name": "mFi Beta",
                "id": 33,
                "urlSlug": "mFi_b",
                "href": "/api/nodes/mFi_b/",
                "children": [ ]
              }, {
                "name": "mFi General",
                "id": 32,
                "urlSlug": "mFi_g",
                "href": "/api/nodes/mFi_g/",
                "children": [ ]
              }, {
                "name": "mFi Stories",
                "id": 390,
                "urlSlug": "mFi_Stories",
                "href": "/api/nodes/mFi_Stories/",
                "children": [ ]
              }, {
                "name": "mFi Q&A",
                "id": 1047,
                "urlSlug": "mFi_QnA",
                "href": "/api/nodes/mFi_QnA/",
                "children": [ ]
              }, {
                "name": "mFi Announcements",
                "id": 376,
                "urlSlug": "mFi_Annoucements",
                "href": "/api/nodes/mFi_Annoucements/",
                "children": [ ]
              }, {
                "name": "mFi Feature Requests",
                "id": 1048,
                "urlSlug": "mFi_Features",
                "href": "/api/nodes/mFi_Features/",
                "children": [ ]
              }, {
                "name": "mFi Bug Tracker",
                "id": 1049,
                "urlSlug": "mFi_Bugs",
                "href": "/api/nodes/mFi_Bugs/",
                "children": [ ]
              }
            ]
          },




          {
            "name": "airFiber",
            "id": 129,
            "urlSlug": "airFiber",
            "href": "/api/nodes/airFiber/",
            "children": [
              {
                "name": "airFiber Alpha",
                "id": 1050,
                "urlSlug": "airFiber_a",
                "href": "/api/nodes/airFiber_a/",
                "children": [ ]
              }, {
                "name": "airFiber Beta",
                "id": 9,
                "urlSlug": "airFiber_b",
                "href": "/api/nodes/airFiber_b/",
                "children": [ ]
              }, {
                "name": "airFiber General",
                "id": 8,
                "urlSlug": "airFiber_g",
                "href": "/api/nodes/airFiber_g/",
                "children": [ ]
              }, {
                "name": "airFiber Stories",
                "id": 392,
                "urlSlug": "airFiber_Stories",
                "href": "/api/nodes/airFiber_Stories/",
                "children": [ ]
              }, {
                "name": "airFiber Q&A",
                "id": 1051,
                "urlSlug": "airFiber_QnA",
                "href": "/api/nodes/airFiber_QnA/",
                "children": [ ]
              }, {
                "name": "airFiber Announcements",
                "id": 131,
                "urlSlug": "airFiber_Annoucements",
                "href": "/api/nodes/airFiber_Annoucements/",
                "children": [ ]
              }, {
                "name": "airFiber Feature Requests",
                "id": 1052,
                "urlSlug": "airFiber_Features",
                "href": "/api/nodes/airFiber_Features/",
                "children": [ ]
              }, {
                "name": "airFiber Bug Tracker",
                "id": 1053,
                "urlSlug": "airFiber_Bugs",
                "href": "/api/nodes/airFiber_Bugs/",
                "children": [ ]
              }
            ]
          },





          {
            "name": "Other Products",
            "id": 121,
            "urlSlug": "other",
            "href": "/api/nodes/other/",
            "children": [
              {
                "name": "airControl Forum",
                "id": 1054,
                "urlSlug": "airControl",
                "href": "/api/nodes/airControl/",
                "children": [ ]
              }, {
                "name": "ToughSwitch Forum",
                "id": 1055,
                "urlSlug": "ToughSwitch",
                "href": "/api/nodes/ToughSwitch/",
                "children": [ ]
              }, {
                "name": "Upcoming Products Forum",
                "id": 1056,
                "urlSlug": "upcoming",
                "href": "/api/nodes/upcoming/",
                "children": [ ]
              }
            ]
          },





          {
            "name": "Legacy General",
            "id": 25,
            "urlSlug": "legacy",
            "href": "/api/nodes/legacy/",
            "children": [
              {
                "name": "Embedded",
                "id": 123,
                "urlSlug": "embedded",
                "href": "/api/nodes/embedded/",
                "children": [
                  {
                    "name": "airView",
                    "id": 14,
                    "urlSlug": "airView",
                    "href": "/api/nodes/airView/",
                    "children": [ ]
                  }, {
                    "name": "RouterStation Challenge",
                    "id": 38,
                    "urlSlug": "routerstation_challenge",
                    "href": "/api/nodes/routerstation_challenge/",
                    "children": [ ]
                  }, {
                    "name": "RouterStation",
                    "id": 48,
                    "urlSlug": "routerstation",
                    "href": "/api/nodes/routerstation/",
                    "children": [ ]
                  }, {
                    "name": "XR SR",
                    "id": 51,
                    "urlSlug": "xr_sr",
                    "href": "/api/nodes/xr_sr/",
                    "children": [ ]
                  }
                ]
              },



              {
                "name": "Cabg",
                "id": 127,
                "urlSlug": "Cabg",
                "href": "/api/nodes/Cabg/",
                "children": [
                  {
                    "name": "Bullet",
                    "id": 19,
                    "urlSlug": "bullet",
                    "href": "/api/nodes/bullet/",
                    "children": [ ]
                  }, {
                    "name": "LiteStation",
                    "id": 31,
                    "urlSlug": "LiteStation",
                    "href": "/api/nodes/listStation/",
                    "children": [ ]
                  }, {
                    "name": "Nanostation Legacy",
                    "id": 34,
                    "urlSlug": "nanostation",
                    "href": "/api/nodes/nanostation/",
                    "children": [ ]
                  }, {
                    "name": "Pico Station",
                    "id": 35,
                    "urlSlug": "picoStation",
                    "href": "/api/nodes/picoStation/",
                    "children": [ ]
                  }, {
                    "name": "Power Station",
                    "id": 37,
                    "urlSlug": "powerStation",
                    "href": "/api/nodes/powerStation/",
                    "children": [ ]
                  }, {
                    "name": "airOS v4 Beta",
                    "id": 13,
                    "urlSlug": "airOSv4_b",
                    "href": "/api/nodes/airOsv4_b/",
                    "children": [ ]
                  }
                ]
              },



              {
                "name": "Consumer",
                "id": 125,
                "urlSlug": "consumer",
                "href": "/api/nodes/consumer/",
                "children": [
                  {
                    "name": "airRouter",
                    "id": 44,
                    "urlSlug": "airRouter",
                    "href": "/api/nodes/airRouter/",
                    "children": [ ]
                  }, {
                    "name": "airWire",
                    "id": 45,
                    "urlSlug": "airWire",
                    "href": "/api/nodes/airWire/",
                    "children": [ ]
                  }, {
                    "name": "PowerAPN",
                    "id": 47,
                    "urlSlug": "PowerAPN",
                    "href": "/api/nodes/PowerAPN/",
                    "children": [ ]
                  }, {
                    "name": "WifiStation",
                    "id": 49,
                    "urlSlug": "WifiStation",
                    "href": "/api/nodes/WifiStation/",
                    "children": [ ]
                  }
                ]
              }
            ]
          }
        ]
      },


      {
        "name": "General Discussion",
        "id": 135,
        "urlSlug": "general_discussion",
        "href": "/api/nodes/general_discussion/",
        "children": [
          {
            "name": "Forum",
            "id": 5,
            "urlSlug": "forum",
            "href": "/api/nodes/forum/",
            "children": [ ]
          }, {
            "name": "Business Talk",
            "id": 20,
            "urlSlug": "bussiness",
            "href": "/api/nodes/business/",
            "children": [ ]
          }, {
            "name": "Welcome",
            "id": 30,
            "urlSlug": "welcome",
            "href": "/api/nodes/welcome/",
            "children": [ ]
          }, {
            "name": "Lounge",
            "id": 42,
            "urlSlug": "lounge",
            "href": "/api/nodes/lounge/",
            "children": [ ]
          }, {
            "name": "UWC",
            "id": 50,
            "urlSlug": "uwc",
            "href": "/api/nodes/uwc/",
            "children": [ ]
          }, {
            "name": "Ubiquiti World Network",
            "id": 405,
            "urlSlug": "uwn",
            "href": "/api/nodes/uwn/",
            "children": [ ]
          }
        ]
      },



      {
        "name": "General Feature Requests",
        "id": 1057,
        "urlSlug": "general_features",
        "href": "/api/nodes/general_features/",
        "children": [
          {
            "name": "Community Feature Requests",
            "id": 155,
            "urlSlug": "community_features",
            "href": "/api/nodes/community_features/",
            "children": [ ]
          }
        ]
      },



      {
        "name": "General Announcements",
        "id": 1058,
        "urlSlug": "announcements",
        "href": "/api/nodes/announcements/",
        "children": [
          {
            "name": "Community Updates",
            "id": 341,
            "urlSlug": "community_announcements",
            "href": "/api/nodes/community_announcements/",
            "children": [ ]
          }, {
            "name": "Announcements News",
            "id": 137,
            "urlSlug": "general_announcements",
            "href": "/api/nodes/general_announcements/",
            "children": [ ]
          }, {
            "name": "Training Announcements",
            "id": 398,
            "urlSlug": "training_announcements",
            "href": "/api/nodes/training_announcements/",
            "children": [ ]
          }
        ]
      },




      {
        "name": "World",
        "id": 139,
        "urlSlug": "world",
        "href": "/api/nodes/world/",
        "children": [
          {
            "name": "Portuguese",
            "id": 36,
            "urlSlug": "portuguese",
            "href": "/api/nodes/portuguese/",
            "children": [ ]
          }, {
            "name": "Spanish",
            "id": 40,
            "urlSlug": "spanish",
            "href": "/api/nodes/spanish/",
            "children": [ ]
          }
        ]
      },




      {
        "name": "Members",
        "id": 141,
        "urlSlug": "members",
        "href": "/api/nodes/members/",
        "children": [
          {
            "name": "Super User Legacy",
            "id": 41,
            "urlSlug": "superuser_legacy",
            "href": "/api/nodes/superuser_legacy/",
            "children": [ ]
          }, {
            "name": "Super User",
            "id": 424,
            "urlSlug": "superuser",
            "href": "/api/nodes/superuser/",
            "children": [ ]
          }, {
            "name": "UCT",
            "id": 46,
            "urlSlug": "uct",
            "href": "/api/nodes/uct/",
            "children": [ ]
          }
        ]
      },




      {
        "name": "BETA",
        "id": 411,
        "urlSlug": "beta",
        "href": "/api/nodes/beta/",
        "children": [
          {
            "name": "Rocket NBE-AC",
            "id": 413,
            "urlSlug": "rocket_nbe-ac",
            "href": "/api/nodes/rocket_nbe-ac/",
            "children": [ ]
          }
        ]
      }
    ]
  }
];