/**
 * cordova is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) Matt Kane 2010
 * Copyright (c) 2011, IBM Corporation
 */


/**
 * I was not able to get PhoneGap.define/require to work
 * but it worked fine when I switched it to cordova.define/require
 * ymmv
 */
//PhoneGap.define("cordova/plugin/BarcodeScanner",
cordova.define("cordova/plugin/BarcodeScanner",
               
               function (require, exports, module) {
               
               var exec = require("cordova/exec");
               
               var BarcodeScanner = function () {
               };
               
               //-------------------------------------------------------------------
               BarcodeScanner.Encode = {
               TEXT_TYPE: "TEXT_TYPE",
               EMAIL_TYPE: "EMAIL_TYPE",
               PHONE_TYPE: "PHONE_TYPE",
               SMS_TYPE: "SMS_TYPE",
               //  CONTACT_TYPE: "CONTACT_TYPE",  // TODO:  not implemented, requires passing a Bundle class from Javascript to Java
               //  LOCATION_TYPE: "LOCATION_TYPE" // TODO:  not implemented, requires passing a Bundle class from Javascript to Java
               };
               
               //-------------------------------------------------------------------
               BarcodeScanner.prototype.scan = function (successCallback, errorCallback) {
               if (errorCallback == null) {
               errorCallback = function () {
               }
               }
               
               if (typeof errorCallback != "function") {
               console.log("BarcodeScanner.scan failure: failure parameter not a function");
               return
               }
               
               if (typeof successCallback != "function") {
               console.log("BarcodeScanner.scan failure: success callback parameter must be a function");
               return
               }
               
               exec(successCallback, errorCallback, 'BarcodeScanner', 'scan', []);
               };
               
               //-------------------------------------------------------------------
               BarcodeScanner.prototype.encode = function (type, data, successCallback, errorCallback, options) {
               if (errorCallback == null) {
               errorCallback = function () {
               }
               }
               
               if (typeof errorCallback != "function") {
               console.log("BarcodeScanner.scan failure: failure parameter not a function");
               return
               }
               
               if (typeof successCallback != "function") {
               console.log("BarcodeScanner.scan failure: success callback parameter must be a function");
               return
               }
               
               exec(successCallback, errorCallback, 'BarcodeScanner', 'encode', [
                                                                                 {"type": type, "data": data, "options": options}
                                                                                 ]);
               };
               
               var barcodeScanner = new BarcodeScanner();
               module.exports = barcodeScanner;
               });
