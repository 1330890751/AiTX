/**
 * H5 service
 */

import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IPlatformService,
  IWifiData,
  IAccontLoginParams,
  IPlatformLoginResult,
} from 'src/app/core/platform/platform-service.interface';
import { PlatformLoginErrorCode } from '@typings/error';
import { UserService } from '../user.service';
import { H5ApiService } from './h5-api.service';
import { CommonUtil } from '@utils/common';
import { TabsService } from '@core/tab.service';
import { Title } from '@angular/platform-browser';

export enum AUTHENLOGIN_TYPE {
  BASE = 1,
  SSO,
  TICKET,
}

@Injectable()
export class H5PlatformService implements IPlatformService {
  constructor(public injector: Injector) {}

  loginErrorPage = 'authenticate';
  loginController = 'UserLogin';
  appEnterRefresh = true; // 刷新后 读取LocalStroage UserInfo 免登录
  // 平台接口初始化完成
  platformAuthReady = false;
  logintype: AUTHENLOGIN_TYPE = AUTHENLOGIN_TYPE.BASE;

  beforeInit(): void {}

  // 注册平台事件
  registerPlatformEvent() {
    const tabService = this.injector.get(TabsService);
    // 获取是不是ios
    const u = navigator.userAgent;
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    // 全局键盘弹出事件
    window.addEventListener('ionKeyboardDidShow', (ev) => {
      console.log('ionKeyboardDidShow');
      // 软键盘弹出隐藏footer
      const footerEl = document.querySelectorAll('ion-footer');
      if (footerEl && footerEl.length > 0) {
        const footer = footerEl[footerEl.length - 1];
        footer.style.display = 'none';
      }
      // 软键盘弹出隐藏首页导航栏
      const tabs = document.getElementById('myTabBar');
      if (tabs) tabs.style.display = 'none';
      // 键盘弹起页面滚动
      if (isAndroid) {
        setTimeout(() => {
          const element: any = document.activeElement;
          if (element.scrollIntoViewIfNeeded) {
            element.scrollIntoViewIfNeeded();
          } else if (element.scrollIntoView) {
            element.scrollIntoView();
          }
        });
      }
    });
    // 全局键盘收起事件
    window.addEventListener('ionKeyboardDidHide', () => {
      console.log('ionKeyboardDidHide');
      // 软键盘收起显示footer
      const footerEl = document.querySelectorAll('ion-footer');
      if (footerEl && footerEl.length > 0) {
        const footer = footerEl[footerEl.length - 1];
        footer.style.display = '';
      }
      // myTabs.style.top = '0';
      console.log('ionKeyboardDidHide', location.href);
      tabService.showHideTabs({ url: location.href });
    });
  }

  /**
   * auth 连接跳转
   */
  authSkip(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
  private setAthenLoinType() {
    const ticket = CommonUtil.getQueryString('ticket');
    const ssoAccount = CommonUtil.getQueryString('account');
    this.logintype = AUTHENLOGIN_TYPE.BASE;
    if (ticket) {
      this.logintype = AUTHENLOGIN_TYPE.TICKET;
      this.setAthenLoginCode(ticket);
    } else if (ssoAccount) {
      this.logintype = AUTHENLOGIN_TYPE.SSO;
      this.setAthenLoginCode(ssoAccount);
    }
  }
  /**
   * 根据 code 设置 sso_ticket
   * @param code code
   */
  private setAthenLoginCode(code) {
    if (code) {
      const accountlist = code.split('#');
      if (accountlist != null && accountlist.length > 0) {
        code = accountlist[0];
      }
      if (code) localStorage.setItem('sso_ticket', code);
    }
  }

  // 免登录授权
  authenLogin(): Promise<any> {
    // 设置AthenLogin type和登录code
    console.log('authenLogin.......');
    this.setAthenLoinType();
    console.log('logintype', this.logintype);
    const code = localStorage.getItem('sso_ticket');
    console.log('setAthenLoinType.......', code);
    // 不是sso 和 ticket 登录
    if (AUTHENLOGIN_TYPE.BASE === this.logintype || !code) {
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    }
    const h5ApiService = this.injector.get(H5ApiService);
    const ssoLogin: Observable<any> = h5ApiService.logInSso(code);
    const ticketLogin: Observable<any> = h5ApiService.logInTicket(code);
    let applyTask: Observable<any>;
    switch (this.logintype) {
      case AUTHENLOGIN_TYPE.SSO:
        applyTask = ssoLogin;
        break;
      case AUTHENLOGIN_TYPE.TICKET:
        applyTask = ticketLogin;
        break;
      default:
        break;
    }

    return new Promise((resolve, reject) => {
      // 调用sso /ssotiket接口。
      applyTask.subscribe((rs) => {
        if (rs && rs.data) {
          const result: IPlatformLoginResult = {
            status: PlatformLoginErrorCode.success,
            data: rs.data,
          };
          resolve(result);
        } else {
          resolve({
            status: PlatformLoginErrorCode.unbind,
            obj: {
              platformUserId: '',
              platformCorpId: '',
            },
          });
        }
      });
    });
  }

  // 授权
  requestAuthCode(): void {}

  // 鉴权
  public authenConfig(): Observable<any> {
    return new Observable((observer) => {
      const errorMsg = '';
      observer.error(errorMsg);
    });
  }

  /** 图片预览 */
  previewImage(imageUrl): Observable<any> {
    return new Observable((observer) => {
      const errorMsg = '';
      observer.error(errorMsg);
    });
  }

  scan(params?): Observable<any> {
    return new Observable((observer) => {
      const errorMsg = '';
      observer.error(errorMsg);
    });
  }

  getWifi(): Observable<IWifiData> {
    return new Observable((observer) => {
      const errorMsg = '';
      observer.error(errorMsg);
    });
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
      sender.uuid = 'C25913789F75BA62B83149082CD7E79C';
      const userService = this.injector.get(UserService);
      // 登录
      userService.logIn2(sender).subscribe((result: any) => {
        if (String(result.errorCode) === '0') {
          rs.status = PlatformLoginErrorCode.success;
          rs.data = result.data;
          resolve(rs);
        } else {
          resolve(rs);
        }
      });
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

  /**
   * 设置title
   * @param str  title名
   */
  setTitle(str) {
    const title = this.injector.get(Title);
    title.setTitle(String(str));
  }

  apiBack() {}
}
