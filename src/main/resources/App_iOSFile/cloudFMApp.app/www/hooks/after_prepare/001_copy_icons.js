#!/usr/bin/env node

//
// This hook copies various resource files
// from our version control system directories
// into the appropriate platform specific location
//


// configure all the files to copy.
// Key of object is the source file,
// value is the destination location.
// It's fine to put all platforms' icons
// and splash screen files here, even if
// we don't build for all platforms
// on each developer's box.
console.log('movingresources');
var filestocopy = [{
    "res/android/icon.png":
    "platforms/android/res/drawable/icon.png"
}, {
    "res/android/hdpi.png":
    "platforms/android/res/drawable-hdpi/icon.png"
}, {
    "res/android/ldpi.png":
    "platforms/android/res/drawable-ldpi/icon.png"
}, {
    "res/android/mdpi.png":
    "platforms/android/res/drawable-mdpi/icon.png"
}, {
    "res/android/xhdpi.png":
    "platforms/android/res/drawable-xhdpi/icon.png"
}, {
    "res/screens/android/res/drawable/splash.png":
    "platforms/android/res/drawable/splash.png"
}, {
    "res/screens/android/res/drawable-hdpi/splash.png":
    "platforms/android/res/drawable-hdpi/splash.png"
}, {
    "res/screens/android/res/drawable-mdpi/splash.png":
    "platforms/android/res/drawable-mdpi/splash.png"
}, {
    "res/screens/android/res/drawable-xhdpi/splash.png":
    "platforms/android/res/drawable-xhdpi/splash.png"
}, {
    "res/ios/icon-72.png":
    "platforms/ios/Cloudfm/Resources/icons/icon-72.png"
}, {
    "res/ios/icon.png":
    "platforms/ios/Cloudfm/Resources/icons/icon.png"
}, {
    "res/ios/icon@2x.png":
    "platforms/ios/Cloudfm/Resources/icons/icon@2x.png"
}, {
    "res/ios/icon-72@2x.png":
    "platforms/ios/Cloudfm/Resources/icons/icon-72@2x.png"
}, {
    "res/screens/ios/Default@2x~iphone.png":
    "platforms/ios/Cloudfm/Resources/splash/Default@2x~iphone.png"
}, {
    "res/screens/ios/Default-568h@2x~iphone.png":
    "platforms/ios/Cloudfm/Resources/splash/Default-568h@2x~iphone.png"
}, {
    "res/screens/ios/Default~iphone.png":
    "platforms/ios/Cloudfm/Resources/splash/Default~iphone.png"
}, {
    "res/screens/ios/Default-Portrait~ipad.png":
     "platforms/ios/Cloudfm/Resources/splash/Default-Portrait~ipad.png"
}, {
    "res/screens/ios/Default-Portrait@2x~ipad.png":
    "platforms/ios/Cloudfm/Resources/splash/Default-Portrait@2x~ipad.png"
}, ];

var fs = require('fs');
var path = require('path');

// no need to configure below
var rootdir = process.argv[2];

filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        //console.log("copying "+srcfile+" to "+destfile);
        var destdir = path.dirname(destfile);
        if ( fs.existsSync(srcfile) && fs.existsSync(destdir) ){
        	fs.createReadStream(srcfile).pipe(
               fs.createWriteStream(destfile)
			);
        }
    });
});
