/**
 * HTTP拦截器：所有HTTP请求都会调用
 *
 */
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { UserService } from 'src/app/core/user.service';
import { NavController } from '@ionic/angular';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError, tap } from 'rxjs/operators';
import { PubSubService } from 'src/app/core/pubsub.service';
import { AuthService } from 'src/app/core/auth.service';
import { Helper } from '@core/help.service';

@Injectable()
export class DefaultHttpInterceptor implements HttpInterceptor {
  APP_LANGUAGE = 'AppLanguage';
  _authService: AuthService;
  constructor(
    public helper: Helper,
    public pubsubService: PubSubService,
    public userService: UserService,
    public authService: AuthService,
    public navCtrl: NavController,
  ) {
    this._authService = authService;
  }
  /**
   * 统一处理HTTP Headers
   */
  getRequestHeaders(headers: HttpHeaders, body?) {
    if (headers.keys().length === 0) {
      let lang = window.localStorage.getItem(this.APP_LANGUAGE) || 'zh-cn';
      if (lang === 'en-gb') lang = 'en';
      const newHeaders = {
        Accept: '*/*',
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + this.authService.getToken(),
      };
      return new HttpHeaders(newHeaders);
    }
    return headers;
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any> | HttpResponse<any>> {
    let url = req.url;
    if (
      url.indexOf('/auth/') === -1 &&
      url.indexOf('/core/') === -1 &&
      url.indexOf('/wechat/') === -1 &&
      url.indexOf('assets/config') < 0
    ) {
      url = `${req.url}`;
    }
    if (!url.startsWith('https://') && !url.startsWith('http://') && url.indexOf('assets') < 0) {
      url = this.helper.getAPIBaseUrl() + url;
    }
    if (url.indexOf('.json') >= 0) {
      // 本地json文件去缓存
      url = url + '?t=' + Math.random();
    }
    let cloneReq = null;
    if (req.method === 'POST') {
      const headers = this.getRequestHeaders(req.headers, req.body);

      // image upload binary data
      cloneReq = req.clone({
        body: req.body,
        url,
        headers,
      });
    } else {
      // console.log(req.params);
      if (
        url.indexOf('/core/company') >= 0 ||
        url.indexOf('/core/member/group') >= 0 ||
        url.indexOf('/getuser-jskticket') >= 0
      ) {
        const cloneParams = req.params;
        cloneReq = req.clone({
          params: cloneParams,
          url,
          headers: this.getRequestHeaders(req.headers, req.body),
        });
      } else {
        let cloneParams = req.params;
        if (!req.params.get('user_id')) cloneParams = cloneParams.set('user_id', '');
        cloneReq = req.clone({
          params: cloneParams,
          url,
          headers: this.getRequestHeaders(req.headers, req.body),
        });
      }
    }
    this.pubsubService.beforeRequest.emit('beforeRequestEvent');
    return next.handle(cloneReq).pipe(
      mergeMap((event: any) => {
        if (event instanceof HttpResponse && event.status === 200) {
          return this.handleData(event);
        }
        return of(event);
      }),
      catchError((err: any) => {
        if (url.indexOf('UserOut') < 0) {
          console.log(cloneReq);
          console.log(err);
          if (err.status !== 401) {
            return this.handleData(err);
          }
        }
        return of(err);
      }),
    );
  }

  private handleData(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {
    switch (event.status) {
      case 200:
        if (event instanceof HttpResponse) {
          const body: any = event.body;
          this.pubsubService.afterRequest.emit('afterRequestEvent');
          if (body.errorCode === 10003) {
            return throwError(
              new HttpResponse(Object.assign(event, { body: { error: body.errorMsg } })),
            );
          } else if (body.errorCode === 10004) {
            this.pubsubService.errorToast.emit('您没有权限');
            return throwError(
              new HttpResponse(Object.assign(event, { body: { error: body.errorMsg } })),
            );
          } else if (body.errorCode === 20106) {
            return throwError(
              new HttpResponse(Object.assign(event, { body: { error: body.errorMsg } })),
            );
          } else if (body && body.errorCode && body.errorCode !== '0' && body.errorCode !== '-2') {
            const url = event.url;
            this.pubsubService.errorToast.emit(body.errorMsg);
            return throwError(
              new HttpResponse(Object.assign(event, { body: { error: body.errorMsg } })),
            );
          } else {
            if (body.error) {
              return throwError({ error: body.error });
            }
            if (body.result !== undefined && body.errorCode !== undefined) {
              return of(new HttpResponse(Object.assign(event, { body: body.result })));
            }
            return of(event);
          }
        }
        break;

      case 403:
        this.pubsubService.errorToast.emit(String((event as any).message));
        return throwError(event);
      case 401: // 未登录状态码
      case 404:
      case 500:
        this.pubsubService.errorToast.emit(`Prompt.Error${event.status}`);
        return throwError(event);
      default:
        if (event instanceof HttpErrorResponse) {
          console.error(event);
          this.pubsubService.errorToast.emit(event.message);
          return throwError(event);
        }
        break;
    }
    return of(event);
  }
}
