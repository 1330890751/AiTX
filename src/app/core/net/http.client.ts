import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
// tslint:disable-next-line:class-name
export class _HttpClient {
  constructor(private http: HttpClient) {}
  parseParams(params: any): HttpParams {
    const newParams = {};
    Object.keys(params).forEach((key) => {
      const _data = params[key];
      newParams[key] = _data;
    });
    return new HttpParams({ fromObject: newParams });
  }

  formEncode(obj) {
    let encodedString = '';
    // tslint:disable-next-line:forin
    for (const key in obj) {
      if (encodedString.length !== 0) {
        encodedString += '&';
      }
      encodedString += key + '=' + encodeURIComponent(obj[key]);
    }
    return encodedString;
  }
å
  appliedUrl(url: string, params?: any) {
    if (!params) {
      return url;
    }
    // tslint:disable-next-line:no-bitwise
    url += ~url.indexOf('?') ? '' : '?';
    const arr: string[] = [];
    // tslint:disable-next-line:forin
    for (const key in params) {
      arr.push(`${key}=${params[key]}`);
    }
    return url + arr.join('&');
  }

  // #region get

  /**
   * GET：返回一个 `T` 类型
   */
  get<T>(
    url: string,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T>;

  /**
   * GET：返回一个 `string` 类型
   */
  get(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * GET：返回一个 `JSON` 类型
   */
  get(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<any>>;

  /**
   * GET：返回一个 `JSON` 类型
   */
  get<T>(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<T>>;

  /**
   * GET：返回一个 `any` 类型
   */
  get(
    url: string,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * GET 请求
   */
  get(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'GET',
      url,
      Object.assign(
        {
          params,
        },
        options,
      ),
    );
  }

  // #endregion

  // #region post

  /**
   * POST：返回一个 `string` 类型
   */
  post(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * POST：返回一个 `HttpResponse<JSON>` 类型
   */
  post(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<any>>;

  /**
   * POST：返回一个 `JSON` 类型
   */
  post<T>(
    url: string,
    body?: any,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T>;

  /**
   * POST：返回一个 `any` 类型
   */
  post(
    url: string,
    body?: any,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * POST 请求
   */
  post(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'POST',
      url,
      Object.assign(
        {
          body,
          params,
        },
        options,
      ),
    );
  }

  // #endregion

  // #region delete

  /**
   * DELETE：返回一个 `string` 类型
   */
  delete(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * DELETE：返回一个 `JSON` 类型
   */
  delete(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<any>>;

  /**
   * DELETE：返回一个 `any` 类型
   */
  delete(
    url: string,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * DELETE 请求
   */
  delete(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'DELETE',
      url,
      Object.assign(
        {
          params,
        },
        options,
      ),
    );
  }

  // #endregion

  /**
   * `jsonp` 请求
   *
   * @param url URL地址
   * @param params 请求参数
   * @param callbackParam CALLBACK值，默认：JSONP_CALLBACK
   */
  jsonp(url: string, params?: any, callbackParam: string = 'JSONP_CALLBACK'): Observable<any> {
    return this.http.jsonp(this.appliedUrl(url, params), callbackParam).pipe(
      tap(() => {
      }),
      catchError((res) => {
        return throwError(res);
      }),
    );
  }

  // #region patch

  /**
   * PATCH：返回一个 `string` 类型
   */
  patch(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * PATCH：返回一个 `HttpResponse<JSON>` 类型
   */
  patch(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<any>>;

  /**
   * PATCH：返回一个 `JSON` 类型
   */
  patch<T>(
    url: string,
    body?: any,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T>;

  /**
   * PATCH：返回一个 `any` 类型
   */
  patch(
    url: string,
    body?: any,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * PATCH 请求
   */
  patch(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'PATCH',
      url,
      Object.assign(
        {
          body,
          params,
        },
        options,
      ),
    );
  }

  // #endregion

  // #region put

  /**
   * PUT：返回一个 `string` 类型
   */
  put(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * PUT：返回一个 `HttpResponse<JSON>` 类型
   */
  put(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<any>>;

  /**
   * PUT：返回一个 `JSON` 类型
   */
  put<T>(
    url: string,
    body?: any,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T>;

  /**
   * PUT：返回一个 `any` 类型
   */
  put(
    url: string,
    body?: any,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * PUT 请求
   */
  put(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'PUT',
      url,
      Object.assign(
        {
          body,
          params,
        },
        options,
      ),
    );
  }

  // #endregion

  /**
   * `request` 请求
   *
   * @param method 请求方法类型
   * @param url URL地址
   * @param options 参数
   */
  request<R>(
    method: string,
    url: string,
    options?: {
      body?: any;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body' | 'events' | 'response';
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      reportProgress?: boolean;
      withCredentials?: boolean;
    },
  ): Observable<R>;
  /**
   * `request` 请求
   *
   * @param method 请求方法类型
   * @param url URL地址
   * @param options 参数
   */
  request(
    method: string,
    url: string,
    options?: {
      body?: any;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body' | 'events' | 'response';
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      reportProgress?: boolean;
      withCredentials?: boolean;
    },
  ): Observable<any> {
    if (options) {
      if (options.params) {
        options.params = this.parseParams(options.params);
      }
      if (options.body) {
        // options.body = this.formEncode(options.body)
      }
    }
    return this.http.request(method, url, options).pipe(
      catchError((res) => {
        return throwError(res);
      }),
    );
  }
}
