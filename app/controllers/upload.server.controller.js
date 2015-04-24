'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash');

var Grid = require('gridfs-stream');
var gfs = new Grid(mongoose.connection.db, mongoose.mongo);
/**
 * Create a Upload
 */
exports.create = function(req, res) {
    /*var part = req.files.filefield;

    var writeStream = gfs.createWriteStream({
        filename: part.name,
        mode: 'w',
        content_type:part.mimetype
    });


    writeStream.on('close', function() {
        return res.status(200).send({
            message: 'Success'
        });
    });

    writeStream.write(part.data);

    writeStream.end();*/
    res.jsonp(req.files.file);
};

/**
 * Show the current Upload
 */
exports.read = function(req, res) {
    gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {

        if(files.length===0){
            return res.status(400).send({
                message: 'File not found'
            });
        }

        res.writeHead(200, {'Content-Type': files[0].contentType});

        var readstream = gfs.createReadStream({
            filename: files[0].filename
        });

        readstream.on('data', function(data) {
            res.write(data);
        });

        readstream.on('end', function() {
            res.end();
        });

        readstream.on('error', function (err) {
            console.log('An error occurred!', err);
            throw err;
        });
    });
};

/**
 * Update a Upload
 */
exports.update = function(req, res) {

};

/**
 * Delete an Upload
 */
exports.delete = function(req, res) {

};

/**
 * List of Uploads
 */
exports.list = function(req, res) {

};