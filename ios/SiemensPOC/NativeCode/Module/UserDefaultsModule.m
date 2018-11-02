//
//  UserDefaultsModule.m
//  ShanshanNewEnergyReactNative
//
//  Created by liangli on 2018/5/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "UserDefaultsModule.h"

@implementation UserDefaultsModule

RCT_EXPORT_MODULE();

// 根据传入的key返回value
RCT_EXPORT_METHOD(get:(NSString *)key resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  resolve([[NSUserDefaults standardUserDefaults] objectForKey:key]);
}

// 存储
RCT_EXPORT_METHOD(set:(NSString *)key value:(id)value) {
  NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
  [userDefaults setObject:value forKey:key];
  [userDefaults synchronize];
}

// 删除
RCT_EXPORT_METHOD(remove:(NSString *)key) {
  NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
  [userDefaults removeObjectForKey:key];
  [userDefaults synchronize];
}

@end
