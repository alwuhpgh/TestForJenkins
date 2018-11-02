package com.wicresoft.siemenspoc.nativecode.app.SRHotUpdate;

import android.content.Context;
import android.os.AsyncTask;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;
import okio.BufferedSink;
import okio.BufferedSource;
import okio.Okio;

public class SRHotUpdateTask extends AsyncTask<SRHotUpdateTaskParams, Void, Void> {
    final int DOWNLOAD_CHUNK_SIZE = 4096;
    byte[] buffer = new byte[1024];

    Context context;

    public SRHotUpdateTask(Context context) {
        this.context = context;
    }

    // 开始更新流程
    private void startUpdate(SRHotUpdateTaskParams params) throws IOException {
        // 下载文件
        downloadFile(params.url, params.zipFilePath);

        // 解压压缩文件到指定目录
        unzipFileToDirectory(params.zipFilePath, params.unzipDirectory);

        // 清理无用内容
        cleanUp(params);
    }

    // 下载文件
    private void downloadFile(String url, File writePath) throws IOException {
        // 请求
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder().url(url)
                .build();
        Response response = client.newCall(request).execute();
        if (response.code() > 299) {
            throw new Error("下载请求错误代码：" + response.code());
        }
        ResponseBody body = response.body();
        long contentLength = body.contentLength();
        BufferedSource source = body.source();

        // 没目录则创建目录
        File writeDirectory = new File(writePath.getParent());
        if (!writeDirectory.exists()) {
            writeDirectory.mkdirs();
        }
        // 删除已存在文件
        if (writePath.exists()) {
            writePath.delete();
        }

        // 存储
        BufferedSink sink = Okio.buffer(Okio.sink(writePath));

        long bytesRead = 0;
        long totalRead = 0;
        while ((bytesRead = source.read(sink.buffer(), DOWNLOAD_CHUNK_SIZE)) != -1) {
            totalRead += bytesRead;
        }
        if (totalRead != contentLength) {
            throw new Error("未能正确存储新的版本");
        }
        sink.writeAll(source);
        sink.close();
    }

    // 解压压缩文件到指定目录
    private void unzipFileToDirectory(File zipFilePath, File unzipDirectory) throws IOException {
        ZipInputStream zis = new ZipInputStream(new BufferedInputStream(new FileInputStream(zipFilePath)));

        // 删除已有目录文件重新创建
        removeDirectory(unzipDirectory);
        unzipDirectory.mkdirs();

        // 逐条解压
        ZipEntry ze;
        while ((ze = zis.getNextEntry()) != null) {
            String fn = ze.getName();
            File fmd = new File(unzipDirectory, fn);

            // 如果是目录则创建目录
            if (ze.isDirectory()) {
                fmd.mkdirs();
                continue;
            }

            // 解压文件
            unzipToFile(zis, fmd);
        }

        // 关闭
        zis.close();
    }

    // 解压文件
    private void unzipToFile(ZipInputStream zis, File fmd) throws IOException {
        int count;

        FileOutputStream fout = new FileOutputStream(fmd);

        while ((count = zis.read(buffer)) != -1) {
            fout.write(buffer, 0, count);
        }

        fout.close();
        zis.closeEntry();
    }

    // 删除目录
    private void removeDirectory(File file) throws IOException {
        if (file.isDirectory()) {
            File[] files = file.listFiles();
            for (File f : files) {
                String name = f.getName();
                if (name.equals(".") || name.equals("..")) {
                    continue;
                }
                removeDirectory(f);
            }
        }
        if (file.exists() && !file.delete()) {
            throw new IOException("删除目录失败");
        }
    }

    // 清理无用内容
    private void cleanUp(SRHotUpdateTaskParams params) throws IOException {
        for (File f : params.rootDirectory.listFiles()) {
            String name = f.getName();
            // 跳过的文件
            if (name.charAt(0) == '.' || name.equals(".") || name.equals("..")) {
                continue;
            }
            // 判断是否为当前版本
            if (name.equals(params.version)) {
                // 是当前版本，则删除除资源文件外的文件
                for (File sub : f.listFiles()) {
                    if (!sub.getAbsolutePath().equals(params.unzipDirectory.getAbsolutePath())) {
                        removeDirectory(sub);
                    }
                }
            } else {
                // 不是当前版本直接删除
                removeDirectory(f);
            }
        }
    }

    @Override
    protected Void doInBackground(SRHotUpdateTaskParams... params) {
        try {
            startUpdate(params[0]);
            params[0].listener.onDownloadCompleted();
        } catch (Throwable e) {
            params[0].listener.onDownloadFailed(e);
        }
        return null;
    }
}
