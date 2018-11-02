package com.wicresoft.siemenspoc;

import android.app.Application;
import android.util.Log;

import com.beefe.picker.PickerViewPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.message.IUmengRegisterCallback;
import com.umeng.message.PushAgent;
import com.wicresoft.siemenspoc.nativecode.MyReactPackage;
import com.wicresoft.siemenspoc.nativecode.app.SRHotUpdate.SRHotUpdateContext;
import com.wicresoft.siemenspoc.nativecode.app.SRHotUpdate.SRHotUpdatePackage;
import com.wicresoft.siemenspoc.nativecode.app.UMengSDK.DplusReactPackage;
import com.wicresoft.siemenspoc.nativecode.app.UMengSDK.RNUMConfigure;

import java.util.Arrays;
import java.util.List;

import javax.annotation.Nullable;


public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new PickerViewPackage(),
                    new ImagePickerPackage(),
                    new MyReactPackage(),
                    new DplusReactPackage(),
                    new SRHotUpdatePackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

        @Nullable
        @Override
        protected String getJSBundleFile() {
            return SRHotUpdateContext.getBundleUrl(MainApplication.this);
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);

        // 初始化友盟
        initUmeng();
    }

    // 初始化友盟
    private void initUmeng() {
        /**
         * 初始化common库
         * 参数1:上下文，不能为空
         * 参数2:友盟 app key
         * 参数3:友盟 channel
         * 参数4:设备类型，UMConfigure.DEVICE_TYPE_PHONE为手机、UMConfigure.DEVICE_TYPE_BOX为盒子，默认为手机
         * 参数5:Push推送业务的secret
         */
        RNUMConfigure.init(this, "5bbafb06f1f5567d1b000063", "Umeng", UMConfigure.DEVICE_TYPE_PHONE, "d6f77610fc83e7d94ea52124c98b9b24");
        // 注册推送
        PushAgent mPushAgent = PushAgent.getInstance(this);
        // 注册推送服务，每次调用register方法都会回调该接口
        mPushAgent.register(new IUmengRegisterCallback() {

            @Override
            public void onSuccess(String deviceToken) {
                //注册成功会返回device token
            }

            @Override
            public void onFailure(String s, String s1) {
            }
        });
    }
}
