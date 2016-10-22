var globalErr;

process.on('exit', function (code) {
    if (globalErr) {
        console.error('\n\n => Suman Server => Uncaught Exception => ' + (globalErr.stack || globalErr) + '\n\n');
    }
    console.log('\n => Suman server exiting with code => ', code, '\n');
});

process.on('SIGINT', function (code) {
    console.log('...SIGINT caught, code => ' + code, ', exiting ...');
    process.exit(code);
});

process.on('uncaughtException', function (err) {
    console.error('\n\n => Suman Server => Uncaught Exception => ' + err.stack, '\n');
    globalErr = err;
    process.nextTick(function () {
        process.exit(1);
    });
});

process.on('unhandledRejection', function (err) {
    console.error('\n\n => Suman Server => Unhandled Rejection => ' + err.stack, '\n');
    globalErr = err;
    process.nextTick(function () {
        process.exit(1);
    });
});

/////////////////////////////////////////////////////////////

//core
const util = require('util');
const path = require('path');
const http = require('http');
const fs = require('fs');

//npm
const _ = require('underscore');
const async = require('async');
const colors = require('colors');

//////////////////////////////////////////////////////////////

const root = global.projectRoot = process.env.SUMAN_PROJECT_ROOT;
const sumanConfig = global.sumanConfig = JSON.parse(process.env.SUMAN_CONFIG);
const sumanExecutablePath = global.sumanExecutablePath = process.env.SUMAN_EXECUTABLE_PATH;

if (process.env.SUMAN_DEBUG === 'yes') {
    console.log('\n', ' => Suman config used:\n', sumanConfig);
}

const sumanLogos = require('./ascii');
console.log(sumanLogos.suman_alligator);

const sumanServerOpts = process.env.SUMAN_SERVER_OPTS;
const sumanCombinedOpts = global.sumanCombinedOpts = sumanServerOpts ? JSON.parse(sumanServerOpts) : {
    sumanMatchesAny: sumanConfig.matchAny,
    sumanMatchesNone: sumanConfig.matchNone,
    sumanMatchesAll: sumanConfig.matchAll,
    sumanHelperDirRoot: sumanConfig.sumanHelpersDir,
    verbose: true,
    vverbose: true
};

Object.keys(sumanCombinedOpts).forEach(opt => {
    global[opt] = sumanCombinedOpts[opt];
});

global.sumanMatchesAny = global.sumanMatchesAny.map(i => new RegExp(i));
global.sumanMatchesNone = global.sumanMatchesNone.map(i => new RegExp(i));
global.sumanMatchesAll = global.sumanMatchesAll.map(i => new RegExp(i));

const opts = global.sumanOpts = global.sumanOpts || {};
opts.verbose = sumanCombinedOpts.verbose;
opts.vverbose = sumanCombinedOpts.vverbose;

/////////////////////////////////////////////////////////////////////////

console.log(' => Suman server starting up...');

const app = require('../app');
app.set('port', process.env.PORT || '6969');
const socketServer = require('./socket-server');
const httpServer = http.createServer(app);

const sumanUtils = require('./utils');

async.parallel([

    function (cb) {

        httpServer.listen(app.get('port'));
        httpServer.once('error', onError);
        httpServer.once('listening', onListening);
        socketServer(httpServer);
        cb();

    },
    function (cb) {
        //ensure that results directory exists, handle any error that is not EEXISTS error
        sumanUtils.makeResultsDir(true, cb);
    }

], function (err, results) {

    if (err) {
        throw err;
    }
    else {
        if (results.filter(r => r).length) {
            console.log('Results:', util.inspect(results));
        }
    }

});

/////////////////////////////////////////////////////////////////////////

function onError(err) {
    console.error(err.stack || err);
}

function onListening() {

    const addr = httpServer.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('\tServer listening on ' + bind, ', CWD =', process.cwd() + '\n\n');

}

