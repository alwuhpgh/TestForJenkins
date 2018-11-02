const SRHotUpdate = require('react-native').NativeModules.SRHotUpdate;

export const downloadRootDir = SRHotUpdate.downloadRootDir;
export const currentVersion = SRHotUpdate.currentVersion;
export const versionDetail = SRHotUpdate.versionDetail;
export const updateDate = SRHotUpdate.updateDate;

// 开始更新
export async function downloadUpdate(options) {
  await SRHotUpdate.downloadUpdate({
    updateUrl: options.updateUrl,
    version: options.version,
    versionDetail: options.versionDetail,
    updateDate: options.updateDate,
  });
}

// 设置版本号
export async function saveVersionInfo(info) {
  await SRHotUpdate.saveVersionInfo({
    version: info.version,
    versionDetail: info.versionDetail,
    updateDate: info.updateDate,
  });
}

// 重启app
export async function restartApp() {
  await SRHotUpdate.restartApp();
}
