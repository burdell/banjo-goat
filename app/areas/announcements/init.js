'use strict';


var app = require('app.init');
app('announcements');

//directives
require('shared/directives/timeline/timeline.js');

//area files
require('shared/pages/newtopic/editmessage.js')('announcements');
require('shared/pages/newtopic/newtopic.js')('announcements');

require('announcements/list/announcements.list.js');
require('announcements/detail/announcements.detail.js');
require('announcements/landing/announcements.landing.js');
require('announcements/config/announcements.routes.js');