import React, {
  NativeModules,
  Platform
} from 'react-native';

class MyStorage {
  /**
   * 获取
   * @param key
   * @returns {Promise}
   */
  static async get(key) {
    switch (Platform.OS) {
      case 'ios':
        return await NativeModules.UserDefaultsModule.get(key);
        break;
      case 'android':
        return await NativeModules.SharedPreferencesModule.get(key);
        break;
      default:
        return await Promise.resolve(null);
        break;
    }
  }

  /**
   * 保存
   * @param key
   * @param value
   */
  static async set(key, value) {
    switch (Platform.OS) {
      case 'ios':
        await NativeModules.UserDefaultsModule.set(key, value);
        break;
      case 'android':
        await NativeModules.SharedPreferencesModule.put(key, value);
        break;
      default:
        break;
    }
  }

  /**
   * 删除
   * @param key
   */
  static async remove(key) {
    switch (Platform.OS) {
      case 'ios':
        await NativeModules.UserDefaultsModule.remove(key);
        break;
      case 'android':
        await NativeModules.SharedPreferencesModule.remove(key);
        break;
      default:
        break;
    }
  }
}

export default MyStorage;