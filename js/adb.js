'use strict';

const execSync = require('child_process').execSync;

exports.devices = function() {
    let result = execSync('adb devices').toString();
    if (result.includes("List of devices attached")) {
        return "端末が接続されていません";
    } else {
        return result;
    }
}
