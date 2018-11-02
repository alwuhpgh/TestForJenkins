/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <UMCommon/UMCommon.h>
#import <UMPush/UMessage.h>
#import <UserNotifications/UserNotifications.h>
#import "RNUMConfigure.h"
#import "SRHotUpdateManager.h"

@interface AppDelegate () <UNUserNotificationCenterDelegate>

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

//#if DEBUG
//  // 原来的jsCodeLocation保留在这里
//  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
//#else
//  // 非DEBUG情况下启用热更新
//  jsCodeLocation = [SRHotUpdateManager bundleUrl];
//#endif
  jsCodeLocation = [SRHotUpdateManager bundleUrl];
  
  // ... 其它代码
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"SiemensPOC"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // 初始化友盟推送
  [self setupUMessageWithLaunchOptions:launchOptions];
  
  return YES;
}

#pragma mark - 初始化友盟推送
- (void)setupUMessageWithLaunchOptions:(NSDictionary *)launchOptions {
  // Push组件基本功能配置
  UMessageRegisterEntity * entity = [[UMessageRegisterEntity alloc] init];
  //type是对推送的几个参数的选择，可以选择一个或者多个。默认是三个全部打开，即：声音，弹窗，角标
  entity.types = UMessageAuthorizationOptionBadge|UMessageAuthorizationOptionSound|UMessageAuthorizationOptionAlert;
  // iOS10之后的代理
  if (@available(iOS 10.0, *)) {
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  } else {
    // Fallback on earlier versions
  }
  // 注册
  [UMessage registerForRemoteNotificationsWithLaunchOptions:launchOptions Entity:entity     completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (granted) {
      // 点击允许
      // 这里可以添加一些自己的逻辑
    } else {
      // 点击不允许
      // 这里可以添加一些自己的逻辑
    }
  }];
  // 打开日志
  [UMConfigure setLogEnabled:YES];
  // appkey
  [RNUMConfigure initWithAppkey:@"5bcecd83f1f556a35500014d" channel:@"App Store"];
}

//iOS10以下使用这两个方法接收通知
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  [UMessage setAutoAlert:NO];
  if([[[UIDevice currentDevice] systemVersion]intValue] < 10){
    [UMessage didReceiveRemoteNotification:userInfo];
  }
  completionHandler(UIBackgroundFetchResultNewData);
}

//iOS10新增：处理前台收到通知的代理方法
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler API_AVAILABLE(ios(10.0)) {
  NSDictionary * userInfo = notification.request.content.userInfo;
  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    // 应用处于前台时的远程推送接受
    // 关闭U-Push自带的弹出框
    [UMessage setAutoAlert:NO];
    // 必须加这句代码
    [UMessage didReceiveRemoteNotification:userInfo];
  }else{
    // 应用处于前台时的本地推送接受
  }
  completionHandler(UNNotificationPresentationOptionSound|UNNotificationPresentationOptionBadge|UNNotificationPresentationOptionAlert);
}

// iOS10新增：处理后台点击通知的代理方法
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler  API_AVAILABLE(ios(10.0)) {
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    // 应用处于后台时的远程推送接受
    // 必须加这句代码
    [UMessage didReceiveRemoteNotification:userInfo];
  }else{
    // 应用处于后台时的本地推送接受
  }
}

@end
