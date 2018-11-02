package com.wicresoft.siemenspoc;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.wicresoft.siemenspoc.nativecode.app.App;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "SiemensPOC";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        App.context = this;
    }

    @Override
    protected void onResume() {
        super.onResume();
        App.context = this;
    }
}
