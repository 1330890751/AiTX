/**
 * 登录认证服务
 */
import { Injectable } from '@angular/core';
import { _HttpClient } from '@core/net/http.client';
import { Helper } from '@core/help.service';
import _ from 'lodash';
declare var window: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  USER_INFO = 'user_info';

  isAuth = false;
  userInfo: any = {};
  deviceId = null;
  authNodes: any = {};
  token = '';
  companyInfo: any = {};
  roleInfo: any = {};
  constructor(public helper: Helper, public http: _HttpClient) {}

  /**
   * 判断是否登录
   */
  getIsAuth() {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem(this.token);
      this.isAuth = Boolean(token);
      resolve(this.isAuth);
    });
  }

  /**
   * 判断是否登录
   */
  async getIsAdmin() {
    const roleInfo: any = await this.getRole();
    const index = _.findIndex([roleInfo], 1);
    return index > -1;
  }

  /**
   * 获取用户登录信息
   */
  getUser() {
    return new Promise((resolve, reject) => {
      const userInfoStr = localStorage.getItem(this.USER_INFO);
      if (!userInfoStr) {
        resolve({});
      } else {
        this.userInfo = JSON.parse(userInfoStr);
        resolve(this.userInfo);
      }
    });
  }

  /**
   * 获取用户角色信息
   */
  getRole() {
    return new Promise((resolve, reject) => {
      const roleInfoStr = localStorage.getItem(this.USER_INFO);
      if (!roleInfoStr) {
        resolve({});
      } else {
        this.roleInfo = JSON.parse(roleInfoStr);
        resolve(this.roleInfo);
      }
    });
  }

  /**
   * 登录后
   */
  logIn(code) {
    const params: any = {
      server: 'server',
      grant_type: 'wechat_code',
      wechat_code: code,
      client_id: 'web',
    };
    return this.http.get('/auth/oauth/token', params);
  }

  // reset
  reset(params) {
    this.logIn(params);
  }

  /**
   * 认证菜单项
   */
  isAuthNode(nodeId) {
    return this.authNodes['node_' + nodeId] === true;
  }

  /**
   * 退出后
   */
  logOut() {
    this.isAuth = false;
    this.userInfo = {};
    this.authNodes = {};

    // 清除工作空间数据
    localStorage.removeItem('workspace');
    localStorage.removeItem(this.token);

    // this.events.publish('auth:loggedOut');
    // this.events.publish('app:gotoLogin');
  }

  getDeviceId() {
    return '43fd608917eea344b8b7f50718e81d98';
  }

  getToken() {
    return localStorage.getItem(this.token);
  }

  // 判断登录状态
  checkToken() {
    return true;
  }
}
