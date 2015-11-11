'use strict';

var app = require('app.init');
app('forums');


//area files
require('shared/pages/newtopic/newtopic.js')('forums');

require('forums/forums.js');
require('forums/list/forums.list.js');
require('forums/message/forums.message.js');
require('forums/config/forums.routes.js');