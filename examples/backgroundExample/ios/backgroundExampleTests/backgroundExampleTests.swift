import XCTest
import React

class backgroundExampleTests: XCTestCase {

  private let timeoutSeconds: TimeInterval = 600
  private let textToLookFor = "Background Actions"

  func testRendersWelcomeScreen() throws {
    guard let vc = UIApplication.shared.delegate?.window??.rootViewController else {
      XCTFail("No root view controller found")
      return
    }

    let deadline = Date(timeIntervalSinceNow: timeoutSeconds)
    var foundElement = false
    var redboxError: String? = nil

    #if DEBUG
    RCTSetLogFunction { level, _, _, _, message in
      if level.rawValue >= RCTLogLevel.error.rawValue {
        redboxError = message
      }
    }
    #endif

    while Date() < deadline && !foundElement && redboxError == nil {
      RunLoop.main.run(mode: .default, before: Date(timeIntervalSinceNow: 0.1))
      RunLoop.main.run(mode: .common, before: Date(timeIntervalSinceNow: 0.1))
      foundElement = findSubview(in: vc.view) { $0.accessibilityLabel == self.textToLookFor }
    }

    #if DEBUG
    RCTSetLogFunction(RCTDefaultLogFunction)
    #endif

    XCTAssertNil(redboxError, "RedBox error: \(redboxError ?? "")")
    XCTAssertTrue(
      foundElement,
      "Couldn't find element with text '\(textToLookFor)' in \(Int(timeoutSeconds)) seconds"
    )
  }

  private func findSubview(in view: UIView, matching test: (UIView) -> Bool) -> Bool {
    if test(view) { return true }
    return view.subviews.contains { findSubview(in: $0, matching: test) }
  }
}
