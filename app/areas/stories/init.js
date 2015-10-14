'use strict';

var app = require('app.init');
app('stories');

//area files
require('stories/stories.js');
require('stories/detail/stories.detail.js');
require('stories/landing/stories.landing.js');
require('stories/list/stories.list.js');
require('stories/newstory/stories.newstory.js');
require('stories/config/stories.routes.js');
