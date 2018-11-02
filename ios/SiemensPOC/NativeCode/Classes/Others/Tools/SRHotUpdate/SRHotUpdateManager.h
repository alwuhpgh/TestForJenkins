//
//  SRHotUpdateManager.h
//  SiemensPOC
//
//  Created by liangli on 2018/10/31.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SRHotUpdateTaskModel.h"

@interface SRHotUpdateManager : NSObject

- (void)updateWithUrl:(NSString *)url version:(NSString *)version versionDetail:(NSString *)versionDetail callback:(SRHotUpdateCallback)callback;
- (void)saveVersionInfoWithVersion:(NSString *)version versionDetail:(NSString *)versionDetail updateDate:(NSString *)updateDate;

- (NSString *)rootDir;
- (NSString *)currentVersion;
- (NSString *)versionDetail;
- (NSString *)updateDate;

+ (NSURL *)bundleUrl;

@end
