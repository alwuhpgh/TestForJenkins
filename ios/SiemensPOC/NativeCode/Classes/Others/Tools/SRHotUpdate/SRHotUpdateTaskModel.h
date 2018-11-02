//
//  SRHoteUpdateTaskModel.h
//  SiemensPOC
//
//  Created by liangli on 2018/10/31.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void (^SRHotUpdateCallback)(NSError *error);

@interface SRHotUpdateTaskModel : NSObject

@property (nonatomic, copy) NSString *url;
@property (nonatomic, copy) NSString *version;
@property (nonatomic, copy) NSString *versionDetail;
@property (nonatomic, copy) NSString *rootDirectory;
@property (nonatomic, copy) NSString *zipFilePath;
@property (nonatomic, copy) NSString *unzipDirectory;
@property (nonatomic, copy) SRHotUpdateCallback callback;

@end
