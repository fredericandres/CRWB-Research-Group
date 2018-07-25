
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <Foundation/Foundation.h>

#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#endif

@interface RNSafeAreaGetter : NSObject <RCTBridgeModule>

@end
  