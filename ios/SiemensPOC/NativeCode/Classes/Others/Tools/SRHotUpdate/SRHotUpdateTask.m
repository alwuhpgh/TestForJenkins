//
//  SRHotUpdateTask.m
//  SiemensPOC
//
//  Created by liangli on 2018/10/31.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "SRHotUpdateTask.h"
#import "SRHotUpdateTaskModel.h"
#import "SRHotUpdateDownLoader.h"
#import "ZipArchive.h"

@implementation SRHotUpdateTask

#pragma mark - 开始更新流程
- (void)startUpdate:(SRHotUpdateTaskModel *)params {
  // 下载文件
  [SRHotUpdateDownLoader downloadWithParams:params completionHandler:^(NSString *path, NSError *error) {
    if (error) {
      params.callback(error);
    } else {
      // 解压文件
      [self unzipFileAtPath:params.zipFilePath toDestination:params.unzipDirectory progressHandler:nil completionHandler:^(NSString *path, BOOL succeeded, NSError *error) {
        if (error) {
          params.callback(error);
        } else {
          // 清理无用内容
          [self cleanUp:params];
          // 返回
          params.callback(nil);
        }
      }];
    }
  }];
}

#pragma mark - 解压文件
- (void)unzipFileAtPath:(NSString *)path
          toDestination:(NSString *)destination
        progressHandler:(void (^)(NSString *entry, long entryNumber, long total))progressHandler
      completionHandler:(void (^)(NSString *path, BOOL succeeded, NSError *error))completionHandler {
  // 删除已有目录文件重新创建
  NSFileManager *manager = [NSFileManager defaultManager];
  NSError *creatError;
  [manager removeItemAtPath:destination error:nil];
  [manager createDirectoryAtPath:destination withIntermediateDirectories:YES attributes:nil error:&creatError];
  
  [SSZipArchive unzipFileAtPath:path toDestination:destination progressHandler:^(NSString *entry, unz_file_info zipInfo, long entryNumber, long total) {
    if (progressHandler) {
      progressHandler(entry, entryNumber, total);
    }
  } completionHandler:^(NSString *path, BOOL succeeded, NSError *error) {
    if (completionHandler) {
      completionHandler(path, succeeded, error);
    }
  }];
}

#pragma mark - 清理无用内容
- (void)cleanUp:(SRHotUpdateTaskModel *)params {
  NSFileManager *manager = [NSFileManager defaultManager];
  // 查看根目录下所有文件夹
  NSError *error;
  NSArray<NSString *> *dirArray = [manager contentsOfDirectoryAtPath:params.rootDirectory error:&error];
  if (error) {
    params.callback(error);
    return;
  }
  for (NSString *dir in dirArray) {
    NSString *dirPath = [params.rootDirectory stringByAppendingPathComponent:dir];
    // 文件（夹）名
    NSString *name = [dir lastPathComponent];
    // 判断是否为当前版本
    if ([name isEqualToString:params.version]) {
      // 是当前版本，则删除除资源文件外的文件
      NSArray<NSString *> *subArr = [manager contentsOfDirectoryAtPath:dirPath error:&error];
      if (error) {
        params.callback(error);
        return;
      }
      for (NSString *sub in subArr) {
        NSString *subDir = [dirPath stringByAppendingPathComponent:sub];
        if ([subDir isEqualToString:params.unzipDirectory] == NO) {
          [manager removeItemAtPath:subDir error:&error];
          if (error) {
            params.callback(error);
            return;
          }
        }
      }
    } else {
      // 不是当前版本直接删除
      [manager removeItemAtPath:dirPath error:&error];
      if (error) {
        params.callback(error);
        return;
      }
    }
  }
}

@end
