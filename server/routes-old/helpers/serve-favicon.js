/**
 * Created by denman on 12/14/2015.
 */



var url = require('url');
var fs = require('fs');
var appRootPath = require('app-root-path');
var path = require('path');


module.exports = function(req,res){

    var helpers = require('../helpers');

    var fsPath = req.sumanData.fsPath;

    console.log('fsPath:', fsPath);

    helpers.serveFile(req,res);

};