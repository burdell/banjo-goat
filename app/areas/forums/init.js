'use strict';

var app = require('app.init');
app('forums');


//area files
require('forums/forums.js');
require('forums/list/forums.list.js');
require('forums/message/forums.message.js');
require('forums/newtopic/forums.newtopic.js');
require('forums/config/forums.routes.js');