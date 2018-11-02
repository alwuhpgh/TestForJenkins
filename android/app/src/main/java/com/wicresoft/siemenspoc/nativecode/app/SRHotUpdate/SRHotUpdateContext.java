package com.wicresoft.siemenspoc.nativecode.app.SRHotUpdate;

import android.content.Context;
import android.content.SharedPreferences;

import java.io.File;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class SRHotUpdateContext {
    private static final String SPCURRENTVERSION = "SPCURRENTVERSION";
    private static final String SPVERSIONDETAIL = "SPVERSIONDETAIL";
    private static final String SPUPDATEDATE = "SPUPDATEDATE";

    private Context context;
    private File rootDir;
    private Executor executor;
    private SharedPreferences sp;

    public SRHotUpdateContext(Context context) {
        this.context = context;
        this.executor = Executors.newSingleThreadExecutor();

        this.rootDir = new File(context.getFilesDir(), "SRHotUpdate");
//        this.rootDir = new File("/storage/emulated/0/aUccc", "SRHotUpdate");

        if (!rootDir.exists()) {
            rootDir.mkdirs();
        }

        this.sp = context.getSharedPreferences("SRHotUpdate", Context.MODE_PRIVATE);
    }

    // 下载文件
    public void downloadFile(String url, String version, String versionDetail, final DownloadFileListener listener) {
        SRHotUpdateTaskParams params = new SRHotUpdateTaskParams();
        params.url = url;
        params.version = version;
        params.listener = listener;
        params.versionDetail = versionDetail;
        params.rootDirectory = rootDir;
        params.zipFilePath = new File(rootDir,  version + "/zip/bundle.zip");
        params.unzipDirectory = new File(rootDir,  version + "/unzip");
        new SRHotUpdateTask(context).executeOnExecutor(this.executor, params);
    }

    // 存储新版本信息
    public void saveVersionInfo(String version, String versionDetail, String updateDate) {
        SharedPreferences.Editor editor = this.sp.edit();
        editor.putString(SPCURRENTVERSION, version);
        editor.putString(SPVERSIONDETAIL, versionDetail);
        editor.putString(SPUPDATEDATE, updateDate);
        editor.commit();
    }

    // 存储位置
    public String getRootDir() {
        return rootDir.toString();
    }

    // bundle位置
    public String getBundleUrl() {
        String currentVersion = getCurrentVersion();
        File bundleFilePath = new File(rootDir, currentVersion + "/unzip/android/index.android.bundle");
        if (bundleFilePath.exists()) {
            return bundleFilePath.toString();
        } else {
            return null;
        }
    }
    public static String getBundleUrl(Context context) {
        return new SRHotUpdateContext(context).getBundleUrl();
    }

    // 版本号
    public String getCurrentVersion() {
        return this.sp.getString(SPCURRENTVERSION, "");
    }

    // 版本更新内容
    public String getVersionDetail() {
        return this.sp.getString(SPVERSIONDETAIL, "");
    }

    // 更新时间
    public String getUpdateDate() {
        return this.sp.getString(SPUPDATEDATE, "");
    }

    public interface DownloadFileListener {
        void onDownloadCompleted();
        void onDownloadFailed(Throwable error);
    }
}
