

const os = require('os');
const path = require('path');


module.exports = function () {

    let cwd = process.cwd();

    // let sumanConfig, serverConfig = null;
    //
    // try {
    //     if (cfgPath) {
    //         sumanConfig = require(cwd + '/' + cfgPath);
    //     }
    //     else {
    //         sumanConfig = require(__dirname + '/../../default-conf-files/suman.default.conf.js');
    //     }
    //
    // }
    // catch (err) {
    //     throw new Error('Suman server could not resolve the path to your config.');
    // }
    //
    // if (sumanConfig.servers) {
    //     serverConfig = sumanConfig.servers[os.hostname()] || sumanConfig.servers['*default'];
    // }


    return Object.freeze({
        // suman_config: sumanConfig,
        // suman_server_config: serverConfig,
        suman_home_dir: path.resolve((process.env.HOME || process.env.USERPROFILE) + '/suman/test_results')
    });


};