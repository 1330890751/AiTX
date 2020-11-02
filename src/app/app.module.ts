import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Helper } from '@core/help.service';
import { AppPlatformService } from '@core/platform/app-platform.service';
import { H5PlatformService } from '@core/platform/h5-platform.service';
import { IPlatformService } from '@core/platform/platform-service.interface';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { KNZMockModule } from '@knz/mock';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PlatformType } from '@typings/app.constant';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '@env/environment';
import { ConfigModule } from '@core/config/config.module';
import * as MockData from '../../_mock';
import { StartupService } from '@core/startup/startup.service';
import { DefaultHttpInterceptor } from '@core/net/default.interceptor';
import { SharedModule } from '@shared/shared.module';

// mock api 加载
const MOCK_MODULES = environment.mockData ? [KNZMockModule.forRoot({ data: MockData })] : [];

// 国际化语言
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

// 预运行的代码
function StartupServiceFactory(startupService: StartupService) {
  return () => startupService.load();
}

// 多平台代码
const platformServiceFactory = (
  helper: Helper,
  injector: Injector,
  platform: Platform,
): IPlatformService => {
  let platformService;
  switch (helper.curerntEnvironment) {
    case PlatformType.H5:
      platformService = new H5PlatformService(injector);
      break;
    default:
      platformService = new AppPlatformService();
      break;
  }
  return platformService;
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    ConfigModule.forRoot(environment),
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'zh-cn',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    [...MOCK_MODULES],
    SharedModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TranslateService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: DefaultHttpInterceptor, multi: true }, // 注入拦截器
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: StartupServiceFactory,
      deps: [StartupService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
