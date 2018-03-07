'use strict';

// アプリモジュールの定義
var appName = "ElectronAdbClient";
var app = angular.module(appName, []);

// モジュールのインポート
const remote = require("electron").remote;
const BrowserWindow = remote.BrowserWindow;
const dialog = remote.dialog;
const adb = require("../js/adb.js");

// サブウィンドウのインスタンス
var mSubWindow = null;

// コントローラー
app.controller('indexController',
    ['$scope', '$window', '$timeout',
    function($scope, $window, $timeout) {
        // 画面の初期化処理
        init($scope);

        /** Devices Reloadボタン */
        $scope.reloadDevices = function() {
            // ロード中表示
            $scope.ReloadBtnLabel = "Loading...";
            $scope.isDevicesLoading = true;

            // adb devices実行（Promise）
            adb.devices().then(function(device) {
                $timeout(function() {
                    $scope.device = "DeviceID: " + device.id
                                    + "/ ModelName: " + device.modelName;
                }, 0);
            }, function(error) {
                $timeout(function() {
                    $scope.device = "Error: " + error;
                }, 0);
            }).then(function() {
                $timeout(function() {
                    // ロード終了
                    $scope.ReloadBtnLabel = "Reload";
                    $scope.isDevicesLoading = false;
                }, 0);
            });
        }

        function init(scope) {
            scope.device = "--";
            scope.ReloadBtnLabel = "Reload";
            scope.isDevicesLoading = false;
        }
    }]
);
