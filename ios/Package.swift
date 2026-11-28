// swift-tools-version: 6.0
//
// Swift Package Manager manifest for react-native-background-actions.
//
// This manifest targets React Native's experimental SwiftPM integration
// (`npx react-native spm`, React Native >= 0.87). CocoaPods users keep using
// `react-native-background-actions.podspec`; this file is ignored by them.
//
// It is NOT meant to be added to an Xcode project by hand: the React Native
// SwiftPM autolinker references it through a symlink located at
//   <app>/ios/build/generated/autolinking/libs/RNBackgroundActions
// and SwiftPM resolves the relative `.package(path:)` entries below against
// that symlink. They therefore point to:
//   - <app>/ios/build/xcframeworks   (React Native prebuilt XCFrameworks)
//   - <app>/ios/build/generated/ios  (per-app codegen package)
// both of which are produced by `npx react-native spm`.
//
// The SwiftPM name must stay in sync with `swiftpmConfig.name` in package.json.

import PackageDescription

let package = Package(
    name: "RNBackgroundActions",
    platforms: [.iOS("15.1")],
    products: [
        .library(name: "RNBackgroundActions", targets: ["RNBackgroundActions"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
    ],
    targets: [
        .target(
            name: "RNBackgroundActions",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
            ],
            path: ".",
            sources: [
                "RNBackgroundActions.m",
            ],
            publicHeadersPath: "include",
            cSettings: [.headerSearchPath(".")],
            linkerSettings: [.linkedFramework("UIKit"), .linkedFramework("Foundation")]
        ),
    ]
)
