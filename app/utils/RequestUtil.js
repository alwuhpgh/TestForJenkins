import { logoutAccount } from './util';

class RequestUtil {

  /**
   *  发送一个post请求
   *
   *  @param url      请求路径
   *  @param params   请求参数
   *  @param success  请求成功后的回调
   *  @param failure  请求失败后的回调
   */
  static post(url, params, success, failure) {
    console.log('posturl:', url);
    let body = '';
    if (params) {
      let paramsArray = [];
      for (var [key, value] of params) {
        paramsArray.push(key + '=' + value);
      }
      body = paramsArray.join('&');
    }
    console.log('body:', body);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    })
      .then((response) => {
        // console.log(response);
        if (!response.ok) {
          console.log('success1');
          return response.json();
        } else {
          console.log('success2');
          return response.json();
        }
      })
      .then((responseJson) => {
        console.log('success3', JSON.stringify(responseJson));
        if (responseJson.code == '03') {
          // 登陆超时时登出
          this._timeoutId = setTimeout(() => {
            logoutAccount();
          }, 1000);
        }
        success(responseJson);
      })
      .catch((error) => {
        console.log('error', error);
        failure(error);
      });
  }

  static get() {

  }

  /**
   *  上传图片
   *
   *  @param url      请求路径
   *  @param params   请求参数
   *  @param success  请求成功后的回调
   *  @param failure  请求失败后的回调
   */
  static uploadImage(url, params, success, failure) {
    console.log('posturl:', url);
    console.log('params:');
    console.log(params);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: params,
    })
      .then((response) => {
        if (!response.ok) {
          console.log('success1');
          return response.json();
        } else {
          console.log('success2');
          return response.json();
        }
      })
      .then((responseJson) => {
        console.log('success3', JSON.stringify(responseJson));
        success(responseJson);
      })
      .catch((error) => {
        console.log('error', JSON.stringify(error));
        failure(error);
      });
  }
}

module.exports = RequestUtil;
