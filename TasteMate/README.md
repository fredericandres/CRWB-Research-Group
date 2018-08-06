# Tastemate

Welcome to the Tastemate project. 

## Important links
* [Firebase Console](https://console.firebase.google.com/) 
* [Google Play Console](https://play.google.com/apps/publish/) 
* [App StoreConnect](https://appstoreconnect.apple.com/) 

## Release

### Android
1. In `TasteMate/android/gradle.properties`, make sure you have 
   ```
   TASTEMATE_RELEASE_STORE_FILE=tastemate-key.keystore
   TASTEMATE_RELEASE_KEY_ALIAS=tastemate-key-alias
   TASTEMATE_RELEASE_STORE_PASSWORD=*
   TASTEMATE_RELEASE_KEY_PASSWORD=*
   ```
   *Insert the correct passwords

2. Verify that `TasteMate/android/app/google-services.json` is the firebase file that points to the production database

3. Run the following code
   ```
   $ cd TasteMate/android/
   $ export JAVA_HOME=$(/usr/libexec/java_home -v 1.8)
   $ ./gradlew assembleRelease
   ```

4. Find `app-release.apk` in `TasteMate/android.app/build/outputs/apk/release`

5. Upload `app-release.apk` at the [Google Play Console](https://play.google.com/apps/publish/) 

### iOS
1. Verify that `TasteMate/ios/GoogleService-Info.plist` is the firebase file that points to the production database

2. The file at `TasteMate/ios/TasteMate/AppDelegate.m` should look like this
   ```
   //jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
   jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
   ```

3. Remove localhost from the `NSExceptionDomains` in `TasteMate/ios/TasteNate/Info.plist`

4. Change the Xcode scheme from `Debug` to `Release`

5. Run Xcode

