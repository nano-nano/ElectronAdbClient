'use strict';

// アプリモジュールの定義
var appName = "ElectronAdbClient";
var app = angular.module(appName, []);

// モジュールのインポート
const remote = require("electron").remote;
const BrowserWindow = remote.BrowserWindow;
const dialog = remote.dialog;
const adb = require("../js/adb.js");


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

        /** select apkボタン */
        $scope.selectInstallApk = function() {
            dialog.showOpenDialog(BrowserWindow, function(filePath) {
                if (filePath[0] == null) {
                    dialog.showErrorBox("Error!!", "apkファイルが指定されていません");
                    return;
                }
                $timeout(function() {
                    $scope.installApkPath = filePath[0];
                }, 0);
            });
        }

        /** installボタン */
        $scope.installApk = function() {
            if ($scope.installApkPath == undefined || $scope.installApkPath == "") {
                dialog.showErrorBox("Error!!", "apkファイルが指定されていません");
                return;
            }

            // 実行中表示
            $scope.InstallBtnLabel = "Installing...";
            $scope.isApkInstalling = true;

            // adb install実行（Promise）
            adb.install($scope.installApkPath, $scope.isUpdateInstall).then(function() {
                var win = remote.getCurrentWindow();
                var options = {
                    type: 'info',
                    buttons: ['OK'],
                    title: "Install apk",
                    message: "インストールに成功しました",
                };
                dialog.showMessageBox(win, options);
            }, function(error) {
                dialog.showErrorBox("Error!!", error);
            }).then(function() {
                $timeout(function() {
                    // インストール終了
                    $scope.InstallBtnLabel = "Install";
                    $scope.isApkInstalling = false;
                }, 0);
            });
        }

        /** uninstallボタン */
        $scope.uninstall = function() {
            if ($scope.uninstallPackage == undefined || $scope.uninstallPackage == "") {
                dialog.showErrorBox("Error!!", "パッケージ名が指定されていません");
                return;
            }

            // 実行中表示
            $scope.UninstallBtnLabel = "Uninstalling...";
            $scope.isUninstalling = true;

            // adb uninstall実行（Promise）
            adb.uninstall($scope.uninstallPackage).then(function() {
                var win = remote.getCurrentWindow();
                var options = {
                    type: 'info',
                    buttons: ['OK'],
                    title: "Uninstall apk",
                    message: "アンインストールに成功しました",
                };
                dialog.showMessageBox(win, options);
            }, function(error) {
                dialog.showErrorBox("Error!!", error);
            }).then(function() {
                $timeout(function() {
                    // アンインストール終了
                    $scope.UninstallBtnLabel = "Uninstall";
                    $scope.isUninstalling = false;
                }, 0);
            });
        }

        /** clearボタン */
        $scope.clearData = function() {
            if ($scope.clearPackage == undefined || $scope.clearPackage == "") {
                dialog.showErrorBox("Error!!", "パッケージ名が指定されていません");
                return;
            }

            // 実行中表示
            $scope.ClearBtnLabel = "Clearing...";
            $scope.isClearing = true;

            // adb shell pm clear実行（Promise）
            adb.clearData($scope.clearPackage).then(function() {
                var win = remote.getCurrentWindow();
                var options = {
                    type: 'info',
                    buttons: ['OK'],
                    title: "Uninstall apk",
                    message: "アプリデータのクリアに成功しました",
                };
                dialog.showMessageBox(win, options);
            }, function(error) {
                dialog.showErrorBox("Error!!", error);
            }).then(function() {
                $timeout(function() {
                    // クリア終了
                    $scope.ClearBtnLabel = "Clear";
                    $scope.isClearing = false;
                }, 0);
            });
        }

        function init(scope) {
            scope.device = "--";
            scope.ReloadBtnLabel = "Reload";
            scope.isDevicesLoading = false;
            scope.InstallBtnLabel = "Install"
            scope.isApkInstalling = false;
            scope.isUpdateInstall = false;
            scope.UninstallBtnLabel = "Uninstall";
            scope.isUninstalling = false;
            scope.ClearBtnLabel = "Clear";
            scope.isClearing = false;
        }
    }]
);
