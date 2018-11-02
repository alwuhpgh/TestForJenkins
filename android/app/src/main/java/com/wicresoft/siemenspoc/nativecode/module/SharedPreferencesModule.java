package com.wicresoft.siemenspoc.nativecode.module;

import android.content.Context;
import android.content.SharedPreferences;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.wicresoft.siemenspoc.nativecode.app.App;

/**
 * Created by liangli on 2018/5/10.
 */

public class SharedPreferencesModule extends ReactContextBaseJavaModule {

    private static final String SPNAME = "SPNAME";

    public SharedPreferencesModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SharedPreferencesModule";
    }

    @ReactMethod
    public void get(String key, Promise promise) {
        SharedPreferences read = App.context.getSharedPreferences(SPNAME, Context.MODE_PRIVATE);
        promise.resolve(read.getString(key, ""));
    }

    @ReactMethod
    public void put(String key, String value) {
        SharedPreferences.Editor editor = App.context.getSharedPreferences(SPNAME, Context.MODE_PRIVATE).edit();
        editor.putString(key, value);
        editor.commit();
    }

    @ReactMethod
    public void remove(String key) {
        SharedPreferences.Editor editor = App.context.getSharedPreferences(SPNAME, Context.MODE_PRIVATE).edit();
        editor.remove(key);
        editor.commit();
    }
}
