'use strict';

const exec = require('child_process').exec;

exports.devices = function() {
    return new Promise(function(resolve, reject) {
        exec('adb devices -l', function(error, stdout, stderr) {
            if (error) {
                reject("エラーが発生しました");
            }
            if (stdout == "List of devices attached\n\n") {
                reject("接続しているデバイスがありません");
            } else {
                // 先頭の文言を削除
                let devicesResult = stdout.replace("List of devices attached\n", "");
                // TODO: 複数デバイス検出時の対応
                let trimmedData = devicesResult.match(/([a-zA-Z0-9]+)\s.+model:([a-zA-Z0-9]+)\s.+/);
                var device = {
                    id: trimmedData[1],
                    modelName: trimmedData[2]
                };
                resolve(device);
            }
        });
    });
}
