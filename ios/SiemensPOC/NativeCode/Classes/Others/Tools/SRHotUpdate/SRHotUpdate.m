//
//  SRHotUpdate.m
//  SiemensPOC
//
//  Created by liangli on 2018/10/31.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "SRHotUpdate.h"
#import "SRHotUpdateManager.h"
#import "SRHotUpdateTaskModel.h"

#import "React/RCTEventDispatcher.h"
#import <React/RCTConvert.h>

@implementation SRHotUpdate

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

#pragma mark - 返回的变量
- (NSDictionary *)constantsToExport {
  SRHotUpdateManager *manager = [[SRHotUpdateManager alloc] init];
  // 返回内容
  NSMutableDictionary *ret = [NSMutableDictionary new];
  ret[@"downloadRootDir"] = [manager rootDir];
  ret[@"currentVersion"] = [manager currentVersion];
  ret[@"versionDetail"] = [manager versionDetail];
  ret[@"updateDate"] = [manager updateDate];
  
  return ret;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

#pragma mark - 开始更新
RCT_EXPORT_METHOD(downloadUpdate:(NSDictionary *)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  NSString *url = options[@"updateUrl"];
  NSString *version = options[@"version"];
  NSString *versionDetail = options[@"versionDetail"];
  NSString *updateDate = options[@"updateDate"];
  SRHotUpdateManager *manager = [[SRHotUpdateManager alloc] init];
  [manager updateWithUrl:url version:version versionDetail:versionDetail callback:^(NSError *error) {
    if (error) {
      reject([NSString stringWithFormat: @"%lu", (long)error.code], error.localizedDescription, error);
    } else {
      // 存储新版本信息
      [manager saveVersionInfoWithVersion:version versionDetail:versionDetail updateDate:updateDate];
      
      resolve(nil);
    }
  }];
}

#pragma mark - 设置版本信息
RCT_EXPORT_METHOD(saveVersionInfo:(NSDictionary *)info) {
  NSString *version = info[@"version"];
  NSString *versionDetail = info[@"versionDetail"];
  NSString *updateDate = info[@"updateDate"];
  // 存储版本信息
  SRHotUpdateManager *manager = [[SRHotUpdateManager alloc] init];
  [manager saveVersionInfoWithVersion:version versionDetail:versionDetail updateDate:updateDate];
}

#pragma mark - 重启app
RCT_EXPORT_METHOD(restartApp) {
  // reload
  dispatch_async(dispatch_get_main_queue(), ^{
    [_bridge setValue:[SRHotUpdateManager bundleUrl] forKey:@"bundleURL"];
    [_bridge reload];
  });
}

@end
