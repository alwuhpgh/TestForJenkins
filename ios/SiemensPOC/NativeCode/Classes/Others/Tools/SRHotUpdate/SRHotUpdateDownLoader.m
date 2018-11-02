//
//  SRHotUpdateDownLoader.m
//  SiemensPOC
//
//  Created by liangli on 2018/10/31.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "SRHotUpdateDownLoader.h"
#import "SRHotUpdateTaskModel.h"

@interface SRHotUpdateDownLoader () <NSURLSessionDownloadDelegate>

@property (copy) void (^progressHandler)(long long, long long);
@property (nonatomic, copy) void (^completionHandler)(NSString*, NSError*);
@property (nonatomic, copy) NSString *savePath;

@end

@implementation SRHotUpdateDownLoader

+ (void)downloadWithParams:(SRHotUpdateTaskModel *)params completionHandler:(void (^)(NSString *path, NSError *error))completionHandler {
  NSAssert(params.url, @"no download path");
  NSAssert(params.zipFilePath, @"no save path");
  
  SRHotUpdateDownLoader *downloader = [SRHotUpdateDownLoader new];
  downloader.progressHandler = nil;
  downloader.completionHandler = completionHandler;
  downloader.savePath = params.zipFilePath;
  
  [downloader downloadToPath:params.url];
}

- (void)downloadToPath:(NSString *)path {
  // 创建会话
  NSURLSessionConfiguration *sessionConfig = [NSURLSessionConfiguration defaultSessionConfiguration];
  NSURLSession *session = [NSURLSession sessionWithConfiguration:sessionConfig
                                                        delegate:self
                                                   delegateQueue:[NSOperationQueue mainQueue]];
  // 创建下载任务
  NSURL *url = [NSURL URLWithString:path];
  NSURLSessionDownloadTask *task = [session downloadTaskWithURL:url];
  // 开始任务
  [task resume];
}

#pragma mark - NSURLSessionDelegate代理方法
/*
 * 下载过程中调用，用于跟踪下载进度
 * @param bytesWritten为单次下载大小
 * @param totalBytesWritten为当当前一共下载大小
 * @param totalBytesExpectedToWrite为文件大小
 */
- (void)URLSession:(NSURLSession *)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didWriteData:(int64_t)bytesWritten totalBytesWritten:(int64_t)totalBytesWritten totalBytesExpectedToWrite:(int64_t)totalBytesExpectedToWrite {
    if (self.progressHandler) {
    self.progressHandler(totalBytesWritten ,totalBytesExpectedToWrite);
  }
}

/*
 * 下载完成调用，并且支持自动保存下载内容到沙盒目录的Cash缓存中，需要手动转移到Documents
 * @param session 为当前下载会话
 * @param downloadTask 为当前下载任务
 * @param location 为默认文件临时存放路径地址
 */
- (void)URLSession:(NSURLSession *)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didFinishDownloadingToURL:(NSURL *)location {
  // 判断要写入的目录是否存在，不存在则创建
  NSFileManager *manager = [NSFileManager defaultManager];
  NSString *saveDir = [self.savePath stringByDeletingLastPathComponent];
  if ([manager fileExistsAtPath:saveDir] == NO) {
    NSError *creatError;
    [manager createDirectoryAtPath:saveDir withIntermediateDirectories:YES attributes:nil error:&creatError];
    if (creatError) {
      if (self.completionHandler) {
        self.completionHandler(nil, creatError);
      }
    }
  }
  // 删除已存在文件
  if ([manager fileExistsAtPath:self.savePath]) {
    [manager removeItemAtPath:self.savePath error:nil];
  }
  
  // 开始写入
  NSData *data = [NSData dataWithContentsOfURL:location];
  NSError *error;
  [data writeToFile:self.savePath options:NSDataWritingAtomic error:&error];
  if (error) {
    if (self.completionHandler) {
      self.completionHandler(nil, error);
    }
  }
}

/*
 * 该方法下载成功和失败都会回调，只是失败的是error是有值的，
 * 在下载失败时，error的userinfo属性可以通过NSURLSessionDownloadTaskResumeData
 * 这个key来取到resumeData(和上面的resumeData是一样的)，再通过resumeData恢复下载
 */
- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error {
  if (self.completionHandler) {
    self.completionHandler(self.savePath, error);
  }
}

@end
