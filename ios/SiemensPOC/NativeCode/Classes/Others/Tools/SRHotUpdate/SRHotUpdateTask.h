//
//  SRHotUpdateTask.h
//  SiemensPOC
//
//  Created by liangli on 2018/10/31.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
@class SRHotUpdateTaskModel;

@interface SRHotUpdateTask : NSObject

- (void)startUpdate:(SRHotUpdateTaskModel *)param;

@end
