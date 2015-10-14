'use strict';


var app = require('app.init');
app('directory');

//area files
require('directory/directory/directory.js');
require('directory/feed/feed.js');
require('directory/hub/hub.js');
require('directory/config/directory.routes.js');