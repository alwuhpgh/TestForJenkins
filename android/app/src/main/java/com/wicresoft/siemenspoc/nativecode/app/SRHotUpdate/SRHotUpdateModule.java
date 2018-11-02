package com.wicresoft.siemenspoc.nativecode.app.SRHotUpdate;

import android.app.Activity;
import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.JSBundleLoader;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

public class SRHotUpdateModule extends ReactContextBaseJavaModule {
    SRHotUpdateContext updateContext;

    public SRHotUpdateModule(ReactApplicationContext reactContext, SRHotUpdateContext updateContext) {
        super(reactContext);
        this.updateContext = updateContext;
    }

    public SRHotUpdateModule(ReactApplicationContext reactContext) {
        this(reactContext, new SRHotUpdateContext(reactContext.getApplicationContext()));
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("downloadRootDir", updateContext.getRootDir());
        constants.put("currentVersion", updateContext.getCurrentVersion());
        constants.put("versionDetail", updateContext.getVersionDetail());
        constants.put("updateDate", updateContext.getUpdateDate());
        return constants;
    }

    @Override
    public String getName() {
        return "SRHotUpdate";
    }

    // 开始更新
    @ReactMethod
    public void downloadUpdate(ReadableMap options, final Promise promise) {
        String url = options.getString("updateUrl");
        final String version = options.getString("version");
        final String versionDetail = options.getString("versionDetail");
        final String updateDate = options.getString("updateDate");
        updateContext.downloadFile(url, version, versionDetail, new SRHotUpdateContext.DownloadFileListener() {
            @Override
            public void onDownloadCompleted() {
                // 存储新版本信息
                updateContext.saveVersionInfo(version, versionDetail, updateDate);
                promise.resolve(null);
            }

            @Override
            public void onDownloadFailed(Throwable error) {
                promise.reject(error);
            }
        });
    }

    // 设置版本信息
    @ReactMethod
    public void saveVersionInfo(ReadableMap info) {
        String version = info.getString("version");
        String versionDetail = info.getString("versionDetail");
        String updateDate = info.getString("updateDate");
        updateContext.saveVersionInfo(version, versionDetail, updateDate);
    }

    // 重启app
    @ReactMethod
    public void restartApp() {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    Activity activity = getCurrentActivity();
                    Application application = activity.getApplication();
                    ReactInstanceManager instanceManager = ((ReactApplication) application).getReactNativeHost().getReactInstanceManager();

                    try {
                        Field jsBundleField = instanceManager.getClass().getDeclaredField("mJSBundleFile");
                        jsBundleField.setAccessible(true);
                        jsBundleField.set(instanceManager, SRHotUpdateContext.getBundleUrl(application));
                    } catch (Throwable err) {
                        JSBundleLoader loader = JSBundleLoader.createFileLoader(SRHotUpdateContext.getBundleUrl(application));
                        Field loadField = instanceManager.getClass().getDeclaredField("mBundleLoader");
                        loadField.setAccessible(true);
                        loadField.set(instanceManager, loader);
                    }

                    final Method recreateMethod = instanceManager.getClass().getMethod("recreateReactContextInBackground");

                    final ReactInstanceManager finalizedInstanceManager = instanceManager;

                    recreateMethod.invoke(finalizedInstanceManager);

                    activity.recreate();
                } catch (Throwable err) {
                    Log.e("pushy", "Failed to restart application", err);
                }
            }
        });
    }
}
