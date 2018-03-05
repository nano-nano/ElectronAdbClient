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
    ['$scope', '$window',
    function($scope, $window) {
        // 画面の初期化処理
        init($scope);

        /** Devices Reloadボタン */
        $scope.reloadDevices = function() {
            // ロード中表示
            $scope.ReloadBtnLabel = "Loading...";
            $scope.isDevicesLoading = true;

            // adb devices実行（同期）
            $scope.device = adb.devices();

            // ロード終了
            $scope.ReloadBtnLabel = "Reload";
            $scope.isDevicesLoading = false;
        }

        function init(scope) {
            scope.device = "--";
            scope.ReloadBtnLabel = "Reload";
            scope.isDevicesLoading = false;
        }
    }]
);
