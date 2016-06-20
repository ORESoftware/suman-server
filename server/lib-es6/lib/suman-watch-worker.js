process.on('uncaughtException', function (e) {
	if (process.env.SUMAN_DEBUG === 'yes') {
		console.error('\n', ' => Suman watcher process uncaughtException:', e.stack || e, '\n');
	}
});


process.on('error', function (e) {
	if (process.env.SUMAN_DEBUG === 'yes') {
		console.error('\n', ' => Suman watcher process error event:', e.stack || e, '\n');
	}
});


const assert = require('assert');

process.on('message', function (m) {

	const workId = m.workId;
	const fp = m.msg.testPath;
	const transpile = m.msg.transpile;

	if(!transpile){
		process.argv.push('--no-transpile');
	}

	try {
		assert.equal(workId, m.__poolioWorkerId, ' => Suman watcher error, workId and workerId not equal values.');
	}
	catch (e) {
		console.error(e.stack);
	}

	if (process.env.SUMAN_DEBUG === 'yes') {
		console.log('=> SUMAN_DEBUG message => in poolio worker, workId:', workId, 'workerId:', m.__poolioWorkerId);
		console.log('=> SUMAN_DEBUG message => in poolio worker, workerId:', m.__poolioWorkerId);
		console.log('=> SUMAN_DEBUG message => in poolio worker, message:', m);
		console.log('=> SUMAN_DEBUG message => here are process.argv args:', '\n');
		process.argv.forEach((val, index, array) => {
			console.log(`${index}: ${val}`);
		});
	}

	//TODO: process.argv.push('--runner');
	process.argv.push(fp);
	require(process.env.SUMAN_EXECUTABLE_PATH);
	// require('/Users/Olegzandr/WebstormProjects/suman/index.js');

});

//pre-load most likely files necessary, this saves milliseconds, but why not
// require('./pre-load-these/pre-load');


