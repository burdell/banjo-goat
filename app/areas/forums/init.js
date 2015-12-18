'use strict';

var app = require('app.init');
app('forums');

require('services/localization.js')(require('locale/forums.locale.js'));

//area files
require('shared/pages/newtopic/editmessage.js')('forums');
require('shared/pages/newtopic/newtopic.js')('forums');

require('forums/forums.js');
require('forums/list/forums.list.js');
require('forums/message/forums.message.js');
require('forums/config/forums.routes.js');