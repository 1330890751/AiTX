/**
 * 钉钉 调api接口专用service
 */

import { Injectable } from '@angular/core';
import { _HttpClient } from '@core/net/http.client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Helper } from '@core/help.service';

@Injectable({
  providedIn: 'root',
})
export class H5ApiService {
  constructor(public http: _HttpClient, private helper: Helper) {}

  /**
   * 登录事件 ticket
   */
  logInSso(ssoAcount) {
    // 不同设备登录接口
    const controller = 'OpenAPILoginViaAccount';
    const params = {
      ticket: ssoAcount,
    };
    return this.http.post(controller, params).pipe(
      map((res) => {
        return res;
      }),
    );
  }

  /**
   * 登录事件 sso
   */
  logInTicket(ssoAcount) {
    // 不同设备登录接口
    const controller = 'CloudHouseSSO';
    const params = {
      account: ssoAcount,
    };
    return this.http.post(controller, params).pipe(
      map((res) => {
        return res;
      }),
    );
  }
}
