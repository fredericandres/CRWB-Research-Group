
#import "RNSafeAreaGetter.h"
#import <React/RCTUtils.h>
#import <React/RCTLog.h>
#import <Foundation/Foundation.h>

@implementation RNSafeAreaGetter
RCT_EXPORT_MODULE(RNSafeAreaGetter)

RCT_EXPORT_METHOD(getBottomPadding: (RCTResponseSenderBlock) callback)
{
    CGFloat bottomPadding = 0;
    if (@available(iOS 11.0, *)) {
      UIWindow *window = UIApplication.sharedApplication.keyWindow;
      // CGFloat topPadding = window.safeAreaInsets.top;
      bottomPadding = window.safeAreaInsets.bottom;
    }
    callback(@[[NSNull null], [NSNumber numberWithDouble:bottomPadding]]);
}

@end
  