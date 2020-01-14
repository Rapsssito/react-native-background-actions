@import UIKit;
#import "RNBackgroundTimer.h"

@implementation RNBackgroundTimer {
    UIBackgroundTaskIdentifier bgTask;
}

RCT_EXPORT_MODULE()

- (void) _start
{
    [self _stop];
    bgTask = [[UIApplication sharedApplication] beginBackgroundTaskWithName:@"RNBackgroundTimer" expirationHandler:^{
        // Clean up any unfinished task business by marking where you
        // stopped or ending the task outright.
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

RCT_EXPORT_METHOD(resolver:(RCTPromiseResolveBlock)resolve
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
