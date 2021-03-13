@import UIKit;
#import "RNBackgroundActions.h"

@implementation RNBackgroundActions {
    UIBackgroundTaskIdentifier bgTask;
}

RCT_EXPORT_MODULE()
- (NSArray<NSString *> *)supportedEvents
{
    return @[@"expiration"];
}

- (void) _start
{
    [self _stop];
    bgTask = [[UIApplication sharedApplication] beginBackgroundTaskWithName:@"RNBackgroundActions" expirationHandler:^{
        [self onExpiration];
        [[UIApplication sharedApplication] endBackgroundTask: self->bgTask];
        self->bgTask = UIBackgroundTaskInvalid;
    }];
}

- (void) _stop
{
    if (bgTask != UIBackgroundTaskInvalid) {
        [[UIApplication sharedApplication] endBackgroundTask:bgTask];
        bgTask = UIBackgroundTaskInvalid;
    }
}

- (void)onExpiration
{
    [self sendEventWithName:@"expiration"
                       body:@{}];
}

RCT_EXPORT_METHOD(start:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self _start];
    resolve(nil);
}

RCT_EXPORT_METHOD(stop:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [self _stop];
    resolve(nil);
}

@end
