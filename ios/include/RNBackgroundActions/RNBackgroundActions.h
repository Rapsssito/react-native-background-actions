// Swift Package Manager public headers shim (see ios/Package.swift).
// SwiftPM needs `publicHeadersPath` to be a directory that does not also hold
// the package's sources. Mirrors the layout `npx react-native spm scaffold`
// generates for libraries whose headers live at the package root.
// CocoaPods ignores this file (podspec `source_files` is not recursive).
#import "../../RNBackgroundActions.h"
