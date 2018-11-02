//
//  SRHotUpdateDownLoader.h
//  SiemensPOC
//
//  Created by liangli on 2018/10/31.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
@class SRHotUpdateTaskModel;

@interface SRHotUpdateDownLoader : NSObject

+ (void)downloadWithParams:(SRHotUpdateTaskModel *)params completionHandler:(void (^)(NSString *path, NSError *error))completionHandler;

@end
