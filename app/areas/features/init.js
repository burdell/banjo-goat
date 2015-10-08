'use strict';


var app = require('app.init');
app('features');


//area files
require('features/config/features.data.js');
require('features/detail/features.detail.js');
require('features/list/features.list.js');
require('features/config/features.routes.js');