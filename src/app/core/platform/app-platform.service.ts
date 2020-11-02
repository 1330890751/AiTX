import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IAccontLoginParams,
  IPlatformLoginResult,
  IPlatformService,
} from './platform-service.interface';
import { PlatformLoginErrorCode } from '@typings/error';

@Injectable()
export class AppPlatformService implements IPlatformService {
  constructor() {}
  private loginType = '';
  // 登录接口名
  loginController = 'QYWXUserLogin';
  loginErrorPage = 'authenticate';
  appEnterRefresh = false;
  // 平台接口初始化完成
  platformAuthReady = false;

  registerPlatformEvent() {}

  beforeInit() {}

  /**
   * auth 连接跳转
   */
  authSkip(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  authenLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }

  authenConfig(): Observable<any> {
    return new Observable((observer) => {});
  }

  getLocation(type?): Observable<any> {
    return new Observable((observer) => {});
  }

  /**
   * 唤起地图
   * 使用说明：唤起地图页面，获取设备位置及设备附件的POI信息
   */
  openLocation(params) {}

  // 钉钉下载文件 不支持Android和iOS
  previewFile(params, fileInfo?): Observable<string> {
    return new Observable((observer) => {});
  }

  /** 图片预览 */
  previewImage(imageUrl): Observable<any> {
    return new Observable((observer) => {});
  }

  /** 扫码 */
  scan(params?): Observable<any> {
    return new Observable((observer) => {});
  }

  /** wifi列表 钉钉无此功能 */
  wifiList() {
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  /** 获取热点接入信息(wifi) */
  getWifi(): Observable<any> {
    return new Observable((observer) => {});
  }
  /**
   * 账号密码登录
   * @param sender   登录参数
   */
  accountLogin(sender: IAccontLoginParams): Promise<IPlatformLoginResult> {
    return new Promise<IPlatformLoginResult>(async (resolve, reject) => {
      const rs: IPlatformLoginResult = {
        status: PlatformLoginErrorCode.unbind,
        data: null,
      };

      resolve(rs);
    });
  }
  /**
   * 获取设备唯一id
   */
  fetchDeviceId(): Promise<string> {
    const self = this;
    return new Promise<string>((resolve, reject) => {
      resolve('');
    });
  }
  setTitle(str) {}
  authConfirm(): Promise<boolean> {
    return new Promise<boolean>((resolve) => resolve(false));
  }
  apiBack() {}
  closeWindow() {}
}
