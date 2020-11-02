/**
 * 用户相关服务
 */
import { Injectable } from '@angular/core';
import { _HttpClient } from 'src/app/core/net/http.client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Helper } from './help.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  httpOptions = {
    headers: null,
  };
  APP_LANGUAGE = 'AppLanguage';
  constructor(private http: _HttpClient, public authService: AuthService, public helper: Helper) {}

  /**
   * 登录事件
   */
  logIn2(params) {
    return this.http.get('/auth/oauth/token', params);
  }

  getOrganizational(): Observable<any> {
    const url = 'OrganizationalItemApp';
    const params = {};
    const request = this.http.get(url, params).pipe(
      map((res) => {
        const rs: any = res;
        return rs.data;
      }),
    );
    return request;
  }
}
