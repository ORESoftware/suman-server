'use strict';

let _stringify2 = JSON.stringify;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by denman on 12/16/15.
 */

//#config
let config = require('adore')(module, '*suman*', 'server/config/conf');

//#core
let fs = require('fs');
let os = require('os');
let path = require('path');
let async = require('async');

//#npm
let React = require('react');
let ReactDOMServer = require('react-dom/server');

let express = require('express');
let router = express.Router();
let _ = require('underscore');

//#project

//react-components

let HTMLParent = require('../react-components/HTMLParent');
let HTMLAdopterParent = require('../react-components/HTMLAdopterParent');
let TestFileSuite = require('../react-components/TestFileSuite');
let Accordion = require('../react-components/AccordionComp');
let AccordionSection = require('../react-components/AccordionSection');

//#helpers
let helpers = require('./helpers');
// const findSumanServer = require('../../lib/find-suman-server');

router.get('/', function (req, res, next) {

    let outputDir = config.suman_home_dir;

    if (!outputDir) {
        console.error('no outputDir defined');
        return next(new Error('no outputDir defined'));
    }

    let project = ['Rover', 'Viper', 'Falcor', 'Brokerify'];
    let runBy = ['Mike', 'Alex', 'Jim'];
    let runAt = [new Date('December 31 1999 23:59:59'), new Date('December 4, 1995 03:24:00'), new Date('December 17, 1995 09:24:00')];

    fs.readdir(path.resolve(outputDir), function (err, items) {

        if (err) {
            next(err);
        } else {
            items = items.map(function (item) {

                return React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            null,
                            _.sample(project).toString()
                        ),
                        React.createElement(
                            'td',
                            null,
                            React.createElement(
                                'a',
                                { href: '/results/' + item },
                                item
                            )
                        ),
                        React.createElement(
                            'td',
                            null,
                            _.sample(runBy).toString(),
                            ' '
                        ),
                        React.createElement(
                            'td',
                            null,
                            ' ',
                            _.sample(runAt).toString(),
                            ' '
                        )
                    )
                );
            });

            res.send(ReactDOMServer.renderToString(React.createElement(
                'html',
                null,
                React.createElement(
                    'head',
                    null,
                    React.createElement('link', { href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',
                        rel: 'stylesheet' }),
                    React.createElement('link', { rel: 'stylesheet',
                        href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css' }),
                    React.createElement('link', { href: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css',
                        rel: 'stylesheet' }),
                    React.createElement('link', { rel: 'stylesheet',
                        href: '/styles/suman-styles.css' })
                ),
                React.createElement(
                    'body',
                    null,
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'div',
                            null,
                            React.createElement('img', { id: 'suman_logo', 'class': 'col-md-4', src: '/images/suman-main-logo.png' })
                        ),
                        React.createElement(
                            'table',
                            { className: 'table text-center' },
                            React.createElement(
                                'thead',
                                { className: 'text-center' },
                                React.createElement(
                                    'th',
                                    { className: 'text-center' },
                                    ' Project '
                                ),
                                React.createElement(
                                    'th',
                                    { className: 'text-center' },
                                    ' Run ID'
                                ),
                                React.createElement(
                                    'th',
                                    { className: 'text-center' },
                                    ' Run by user'
                                ),
                                React.createElement(
                                    'th',
                                    { className: 'text-center' },
                                    ' Run Date'
                                )
                            ),
                            React.createElement(
                                'tbody',
                                { className: 'text-center' },
                                items
                            )
                        )
                    )
                )
            )));
        }
    });
});

router.post('/done/:runId', function (req, res, next) {

    let data = body.data;

    try {
        let json = (0, _stringify2)(data.test);

        if (data.outputPath) {
            fs.appendFileSync(data.outputPath, json += ','); //we write synchronous because we have to ensure data doesn't get malformed in files on disk
            req.sumanData.success = { msg: 'appended data to ' + data.outputPath };
        } else {
            console.error(new Error('no outputPath property on data: ' + data).stack);
        }
        next();
    } catch (err) {
        next(err);
    }
});

router.post('/finalize', function (req, res, next) {

    let body = req.body;
    let rendered = body.rendered;
    let timestamp = body.timestamp;
    let outputDir = config.suman_home_dir;

    if (!outputDir) {
        console.error('no outputDir defined');
        return next(new Error('no outputDir defined'));
    }

    let outputPath = path.resolve(outputDir + '/' + timestamp + '/temp.html');

    fs.writeFile(outputPath, rendered, function (err) {
        if (err) {
            console.log(err.stack);
            next(err);
        } else {
            res.json({ success: 'wrote rendered .ejs file' });
        }
    });
});

router.post('/make/new', function (req, res, next) {

    let body = req.body;
    let timestamp = body.timestamp;

    try {
        let outputDir = config.suman_home_dir;

        if (!outputDir) {
            console.error('no outputDir defined');
            return next(new Error('no outputDir defined'));
        }

        let outputPath = path.resolve(outputDir + '/' + timestamp);

        fs.mkdir(outputPath, function (err) {
            if (err) {
                console.error(err.stack);
                next(err);
            } else {
                console.log('created dir at ' + outputPath);
                req.sumanData.success = { msg: 'created dir at ' + outputPath };
                next();
            }
        });
    } catch (err) {
        next(err);
    }
});

router.get('/latest', function (req, res, next) {

    //TODO: this should render git branch and commit

    let outputDir = config.suman_home_dir;

    if (!outputDir) {
        console.error('no outputDir defined');
        return next(new Error('no outputDir defined'));
    }

    let folder = path.resolve(outputDir);
    let runId = helpers.getPathOfMostRecentSubdir(folder);

    if (!runId) {
        //TODO this will happen if the suman_results dir is deleted, we should add the folder if it gets deleted
        next(new Error('no latest results exist'));
    } else {

        req.runId = runId;
        req.folder = folder;
        next();
    }
}, getRunId);

function getRunId(req, res, next) {

    let folder = req.folder;
    let runId = req.runId;

    let dirName = path.resolve(folder + '/' + runId);

    fs.readdir(dirName, function (err, items) {

        if (err) {
            next(err);
        } else {
            let j;

            (function () {

                // const children = items.map(function(){
                //
                //      return  {
                //          comp: TestFileSuite,
                //          props: {
                //              item: items
                //          }
                //      }
                //
                //  });
                //
                //
                //  const HTMLParent = HTMLAdopterParent(children);
                //  res.send(ReactDOMServer.renderToString(<HTMLParent />));

                // res.send(ReactDOMServer.renderToString((
                //     <html>
                //     <head>
                //
                //         <link href={'/styles/style-accordion.css'} rel={'stylesheet'} type={'text/css'}></link>
                //
                //     </head>
                //
                //     <body>
                //
                //
                //     <Accordion selected='2'>
                //         <AccordionSection title='Section 1' id='1'>
                //             Section 1 content
                //         </AccordionSection>
                //         <AccordionSection title='Section 2' id='2'>
                //             Section 2 content
                //         </AccordionSection>
                //         <AccordionSection title='Section 3' id='3'>
                //             Section 3 content
                //         </AccordionSection>
                //     </Accordion>
                //     </body>
                //     </html>
                // )));

                // let data = ReactDOMServer.renderToString((
                //     <html>
                //     <head>
                //
                //         <script src="//cdnjs.cloudflare.com/ajax/libs/react/0.14.8/react.js"></script>
                //         <script src="//fb.me/react-dom-0.14.2.js"></script>
                //         <link href={'/styles/style-accordion.css'} rel={'stylesheet'} type={'text/css'}></link>
                //
                //     </head>
                //
                //     <body>
                //     <Accordion title="Accordion Title Here"/>
                //     </body>
                //     </html>
                // ));

                j = 1;


                let childData = [];

                async.each(items, function (item, cb) {

                    fs.readFile(path.resolve(dirName + '/' + item), {}, function (err, data) {

                        if (err) {
                            cb(err);
                        } else {

                            let lastChar = String(data).slice(-1);
                            if (lastChar === ',') {
                                data = String(data).substring(0, String(data).length - 1); //strip off trailing comma
                            }

                            data = JSON.parse('[' + data + ']'); //make parseable by JSON

                            let topLevelDescribe = {};

                            for (let i = 0; i < data.length; i++) {
                                let val = data[i];
                                if (val.testId === 0) {
                                    topLevelDescribe = val;
                                    break;
                                }
                            }

                            let fileName = String(path.basename(item, '.txt'));

                            let props = {
                                title: 'TestSuite: ' + topLevelDescribe.desc + ' @' + fileName,
                                id: j++,
                                runId: runId,
                                testId: fileName
                            };

                            childData.push(props);

                            cb(null, React.createElement(AccordionSection, props));
                        }
                    });
                }, function complete(err, results) {

                    if (err) {
                        next(err);
                    } else {
                        let data = ReactDOMServer.renderToString(React.createElement(
                            Accordion,
                            { title: 'Accordion Title Here' },
                            results
                        ));

                        // res.send(data);

                        res.render('index', {
                            data: data,
                            childData: (0, _stringify2)(childData)
                        });
                    }
                });
            })();
        }
    });
}

router.get('/:runId/:testId', function (req, res, next) {

    let outputDir = config.suman_home_dir;

    if (!outputDir) {
        console.error('no outputDir defined');
        return next(new Error('no outputDir defined'));
    }

    let folder = path.resolve(outputDir);
    let runId = req.params.runId;
    let testNum = req.params.testId;

    fs.readFile(path.resolve(folder + '/' + runId + '/' + testNum + '.txt'), {}, function (err, data) {

        if (err) {
            next(err);
        } else {

            let lastChar = String(data).slice(-1);
            if (lastChar === ',') {
                data = String(data).substring(0, String(data).length - 1); //strip off trailing comma
            }

            data = '[' + data + ']'; //make parseable by JSON
            // let parsed = JSON.parse(data);
            // console.log('parsed:', parsed);
            res.send(data);
            // res.send(ReactDOMServer.renderToString(<TestFileSuite data={parsed}/>));
        }
    });
});

router.get('/:runId', function (req, res, next) {

    let outputDir = config.suman_home_dir;

    if (!outputDir) {
        console.error('no outputDir defined');
        return next(new Error('no outputDir defined'));
    }

    let folder = path.resolve(outputDir);

    req.runId = req.params.runId;
    req.folder = folder;
    next();
}, getRunId);

module.exports = router;