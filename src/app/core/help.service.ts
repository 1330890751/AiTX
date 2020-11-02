/**
 * 工具服务-与其他服务有关系的公用方法
 */
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { APP_VERSION } from '@typings/app.constant';
import { ConfigService } from '@core/config/config.service';

@Injectable({
  providedIn: 'root',
})
export class Helper {
  apiPath: string = null;
  appVersion = '';
  apiPathbak = '';
  assetPath = '';
  curerntEnvironment = '';

  constructor(
    public platform: Platform,
    public configService: ConfigService, // public envConfiguration: EnvConfigurationProvider<IAppEnvConfiguration>
  ) {
    if (localStorage.getItem('APP_VERSION')) {
      this.appVersion = localStorage.getItem('APP_VERSION');
    } else {
      this.appVersion = APP_VERSION;
    }

    if (localStorage.getItem('API_PATH')) {
      this.apiPath = localStorage.getItem('API_PATH');
      this.apiPathbak = this.apiPath;
    }
  }

  /**
   * 获取WebAPI地址
   */
  getAPIBaseUrl(): string {
    if (this.apiPath) {
      return this.apiPath;
    } else {
      this.apiPath = this.configService.get('SERVER_URL');
      this.apiPathbak = this.apiPath;
      return this.apiPath;
    }
  }

  getAPI(url): string {
    return this.getAPIBaseUrl() + url;
  }
}
