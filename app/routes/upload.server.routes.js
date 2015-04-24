'use strict';

module.exports = function(app) {
    var upload  = require('../../app/controllers/upload.server.controller');

    app.route('/upload/:filename')
        .get(upload.read);


    app.route('/upload')
        .post(upload.create);
};