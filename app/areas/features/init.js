'use strict';


var app = require('app.init');
app('features');

require('services/localization.js')(require('locale/features.locale.js'));

//area files
require('shared/pages/newtopic/editmessage.js')('features');
require('shared/pages/newtopic/newtopic.js')('features');

require('features/config/features.data.js');
require('features/detail/features.detail.js');
require('features/list/features.list.js');
require('features/config/features.routes.js');