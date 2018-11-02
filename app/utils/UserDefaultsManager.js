import SRStorage from './SRStorage';

const UserTypeKey = "userTypeKey";
const HistoryIdKey = "historyIdKey";
const LastVersionKey = "SNELastVersionKey";

class UserDefaultsManager {

  // 当前用户信息
  /**
   *  获取userType
   *  @return {Promise} userType
   */
  static async userType() {
    return await SRStorage.get(UserTypeKey);
  }

  /**
   *  存储userType
   *  @param userType userType
   */
  static async setUserType(userType) {
    await SRStorage.set(UserTypeKey, userType);
  }

  /**
   *  清除userType
   */
  static async removeUserType() {
    await SRStorage.remove(UserTypeKey);
  }

  // 登录帐号历史信息
  /**
   *  获取所有历史帐号
   */
  static async historyUsername() {
    return await SRStorage.get(HistoryIdKey);
  }

  /**
   *  存储所有历史帐号
   *  @param historyUsernameArr 所有历史帐号
   */
  static async setHistoryUsername(historyUsername) {
    await SRStorage.set(HistoryIdKey, historyUsername);
  }

  /**
   *  删除所有历史帐号
   */
  static async removeHistoryUsername() {
    await SRStorage.remove(HistoryIdKey);
  }

  // 上次进入时的版本号
  /**
   *  上次进入时的版本号
   *  @return {Promise} 上次进入时的版本号
   */
  static async lastVersion() {
    return await SRStorage.get(LastVersionKey);
  }

  /**
   *  存储上次进入时的版本号
   *  @param lastVersion 上次进入时的版本号
   */
  static async setLastVersion(lastVersion) {
    await SRStorage.set(LastVersionKey, lastVersion);
  }

  /**
   *  删除上次进入时的版本号
   */
  static async removeLastVersion() {
    await SRStorage.remove(LastVersionKey);
  }

}

module.exports = UserDefaultsManager;