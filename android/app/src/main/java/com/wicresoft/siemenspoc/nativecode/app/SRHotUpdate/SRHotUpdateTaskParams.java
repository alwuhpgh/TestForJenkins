package com.wicresoft.siemenspoc.nativecode.app.SRHotUpdate;

import java.io.File;

public class SRHotUpdateTaskParams {
    String      url;
    String      version;
    String      versionDetail;
    File        rootDirectory;
    File        zipFilePath;
    File        unzipDirectory;
    SRHotUpdateContext.DownloadFileListener listener;
}
