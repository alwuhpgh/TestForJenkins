//
//  SRHotUpdateManager.m
//  SiemensPOC
//
//  Created by liangli on 2018/10/31.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <React/RCTBundleURLProvider.h>
#import "SRHotUpdateManager.h"
#import "SRHotUpdateTask.h"

static NSString * const CurrentVersionKey = @"CurrentVersionKey";
static NSString * const VersionDetailKey = @"VersionDetailKey";
static NSString * const UpdateDateKey = @"UpdateDateKey";

@interface SRHotUpdateManager ()

@property (nonatomic, copy) NSString *rootDir;

@end

@implementation SRHotUpdateManager

- (instancetype)init
{
  self = [super init];
  if (self) {
    self.rootDir = [self updateDir];
    
    // 判断目录是否存在，不存在则创建
    NSFileManager *manager = [NSFileManager defaultManager];
    if ([manager fileExistsAtPath:self.rootDir] == NO) {
      [manager createDirectoryAtPath:self.rootDir withIntermediateDirectories:YES attributes:nil error:nil];
    }
  }
  return self;
}

#pragma mark - 获取基础目录
- (NSString *)updateDir {
  NSString *directory = [NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory, NSUserDomainMask, YES) firstObject];
  NSString *downloadDir = [directory stringByAppendingPathComponent:@"SRHotUpdate"];
  return downloadDir;
}

#pragma mark - 开始更新
- (void)updateWithUrl:(NSString *)url version:(NSString *)version versionDetail:(NSString *)versionDetail callback:(SRHotUpdateCallback)callback {
  SRHotUpdateTaskModel *params = [[SRHotUpdateTaskModel alloc] init];
  params.url = url;
  params.version = version;
  params.versionDetail = versionDetail;
  params.callback = callback;
  params.rootDirectory = self.rootDir;
  params.zipFilePath = [NSString stringWithFormat:@"%@/%@/zip/bundle.zip", self.rootDir, version];
  params.unzipDirectory = [NSString stringWithFormat:@"%@/%@/unzip", self.rootDir, version];
  SRHotUpdateTask *updateTask = [[SRHotUpdateTask alloc] init];
  [updateTask startUpdate:params];
}

#pragma mark - 在UserDefaults存储和取东西
#pragma mark -存储新版本信息
- (void)saveVersionInfoWithVersion:(NSString *)version versionDetail:(NSString *)versionDetail updateDate:(NSString *)updateDate {
  NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
  [userDefaults setObject:version forKey:CurrentVersionKey];
  [userDefaults setObject:versionDetail forKey:VersionDetailKey];
  [userDefaults setObject:updateDate forKey:UpdateDateKey];
  [userDefaults synchronize];
}

#pragma mark -版本号
- (NSString *)currentVersion {
  return [[NSUserDefaults standardUserDefaults] objectForKey:CurrentVersionKey];
}

#pragma mark -版本更新内容
- (NSString *)versionDetail {
  return [[NSUserDefaults standardUserDefaults] objectForKey:VersionDetailKey];
}

#pragma mark -更新时间
- (NSString *)updateDate {
  return [[NSUserDefaults standardUserDefaults] objectForKey:UpdateDateKey];
}

#pragma mark - bundle位置
+ (NSURL *)bundleUrl {
  SRHotUpdateManager *updateManager = [[self alloc] init];
  NSString *currentVersion = [updateManager currentVersion];
  NSString *bundlePath = [NSString stringWithFormat:@"%@/%@/unzip/ios/index.ios.bundle", updateManager.rootDir, currentVersion];
  // 判断是否有该目录
  NSFileManager *manager = [NSFileManager defaultManager];
  if ([manager fileExistsAtPath:bundlePath]) {
    return [NSURL fileURLWithPath:bundlePath];;
  } else {
//    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  }
}

@end
