/**
 * 1. 保存页面跳转记录,
 * 2. 对特殊页面在浏览器回退的处理
 * 3. 页面加载完成后设置页面title
 * 4. 抛出 NavigationStart 和 NavigationEnd 事件
 * 5. 重写 router.navigateByUrl 和 router.navigate 跳转方法,缓存 queryParams (支持所有js类型);
 */

import { Injectable, Injector, Optional } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  Event as NavigationEvent,
  NavigationEnd,
  NavigationStart,
  Router,
  ActivatedRoute,
  UrlTree,
  NavigationExtras,
} from '@angular/router';
import { Location } from '@angular/common';
// import { WorkFlowConfig } from '@app/modules/workflow-new/config';
import { AuthService } from '@core/auth.service';
// import { noBackPages } from '@core/config';
// import { AppPlatformService } from '@core/platform/app-platform.service';
import {
  IonRouterOutlet,
  NavController,
  PickerController,
  Platform,
  AlertController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { TabsService } from './tab.service';
import { cloneDeep } from 'lodash';
import { Helper } from './help.service';

const QUERY_PARAMS_STRING = 'QUERY_PARAMS_STRING';
const ROOT_PAGE = 'ROOT_PAGE';

export interface VxNavigationOptions extends NavigationExtras {
  direction?: 'forward' | 'back' | 'none' | 'root';
}

/**
 * 分离 extras.queryParams -> 分为 stringQueryParams 和 所有类型的 queryParams
 * @param queryParams:any
 */
function splitQueryParams(queryParams: any) {
  const stringQuery: any = {};
  if (queryParams) {
    Object.keys(queryParams).forEach((key) => {
      const value = queryParams[key];
      if (value === null || value === undefined || value === '') return;
      const type = typeof value;
      if (type === 'string') stringQuery[key] = encodeURIComponent(value);
      else if (type === 'number') stringQuery[key] = value;
    });
  }
  return { queryParams, stringQuery };
}

/**
 * 裁剪url,类似 将url 转成 window.location.pathname
 */
const shortUrl = (url: string) => url.replace(/[#?].*/, '');
const getUrlSuffix = (url: string) => url.replace(/.*\/([-A-Za-z]+).*/, '$1'); // 获取url的最后路径名称

export interface ICacheRoute {
  id?: number;
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class VxRouteService {
  urlChanging = false;
  isSkip = false;
  private _queryParams: any = {};

  // 合并路由中的参数,解决刷新后 queryString 丢失的问题
  public get queryParams() {
    return {
      ...this.getCacheQueryParams(), // 缓存中的参数
      ...this._queryParams, // 服务缓存即内存中的参数
      ...this.deCodeUrl(this.route.snapshot.queryParams), // url中的参数
    };
  }

  public set queryParams(val) {
    this.setCacheQueryParams(val);
    this._queryParams = val;
  }

  cacheCount = 100; // 保留历史记录的长度
  cacheList: ICacheRoute[] = [];
  navStart$ = new Subject<NavigationStart>();
  navEnd$ = new Subject<NavigationEnd>();

  // 通过浏览器的前进后退进入以下页面时,跳出
//   skipPath = Object.keys(WorkFlowConfig)
//     .map((k) => WorkFlowConfig[k].request_page.toLowerCase())
//     .concat(...noBackPages.map((k) => k.toLocaleLowerCase()));

  // 需跳过的Router id
  skipRouteIds = {};

  // 缓存需要跳过的router id列表（用于有二级页面 需要返回的router）
  skipTempRouteIds: any[] = [];

  currentRouteId: number;

  get prevRoute() {
    return this.cacheList[this.cacheList.length - 2];
  }
  get currentRoute() {
    return this.cacheList[this.cacheList.length - 1];
  }
  get currentShortUrl() {
    return shortUrl(this.location.path());
  }

  // rootPage
  set rootPagePath(path: string) {
    localStorage.setItem(ROOT_PAGE, path);
  }
  // rootPage
  get rootPagePath() {
    return localStorage.getItem(ROOT_PAGE) || '/tabs';
  }

  constructor(
    public title: Title,
    private platform: Platform,
    private router: Router,
    private injector: Injector,
    public popoverCtrl: PopoverController,
    public pickerCtrl: PickerController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public location: Location,
    public route: ActivatedRoute,
    // public appPlatformService: AppPlatformService,
    public tbservice: TabsService,
    public helper: Helper,
    @Optional() private routerOutlet: IonRouterOutlet,
  ) {
    // todo 测试代码,用来调试自定义路由
    (window as any).vxroute = this;
    router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        // console.log('url:', event.url);
        // console.log('routerId:', event.id);
        this.currentRouteId = cloneDeep(event).id;
        this.navStart$.next(event);

        const cacheItem = cloneDeep({ id: event.id, url: event.url });

        try {
          // 从浏览器历史记录中返回时
          if (event.restoredState || event.navigationTrigger === 'popstate') {
            // console.log('navigationId:', event.restoredState.navigationId);
            cacheItem.id = event.restoredState.navigationId;
            const urlSuffix = getUrlSuffix(event.url); // 获取url的最后路径名称
            const notSubUrl = !this.currentRoute || this.currentRoute.url.indexOf(urlSuffix) <= -1;
            // if (this.isSkipPath(urlSuffix) && notSubUrl) {
              location.back();
              this.isSkip = true;
            // } else {
            //   if (!this.platform.is('cordova') && this.isSkipRouteId(cacheItem.id)) {
            //     // 当前不能返回的路由id 记录到跳过名单内。
            //     this.setSkip();
            //     location.back();
            //     this.isSkip = true;
            //   }
            // }
            this.cacheBackRoute(cacheItem);
          } else {
            this.cacheRoute(cacheItem);
          }
        } catch (error) {
          console.log(error);
        }

        /** 关闭picker 和 popover */
        try {
          pickerCtrl.getTop().then((item) => {
            if (item) item.dismiss();
          });
        } catch (error) {
          console.log(`${JSON.stringify(error)}`);
        }
        try {
          popoverCtrl.getTop().then((item) => {
            if (item) item.dismiss();
          });
        } catch (error) {
          console.log(`${JSON.stringify(error)}`);
        }
        try {
          popoverCtrl.getTop().then((item) => {
            if (item) item.dismiss();
          });
        } catch (error) {
          console.log(`${JSON.stringify(error)}`);
        }
        try {
          alertCtrl.getTop().then((item) => {
            if (item) item.dismiss();
          });
        } catch (error) {
          console.log(`${JSON.stringify(error)}`);
        }
        try {
          modalCtrl.getTop().then((item) => {
            if (item) item.dismiss();
          });
        } catch (error) {
          console.log(`${JSON.stringify(error)}`);
        }
      } else if (event instanceof NavigationEnd) {
        try {
          this.navEnd$.next(event);
        } catch (error) {
          console.log(`${JSON.stringify(error)}`);
        }

        try {
          // @ts-ignore 修复切换页面后,系统的选中 复制等操作还存在的bug
          if (document.activeElement !== document.body && document.activeElement.blur) {
            // @ts-ignore
            document.activeElement.blur();
          }
        } catch (error) {
          console.log(`${JSON.stringify(error)}`);
        }
        try {
        //   if (this.helper.environment !== 'cordova') {
        //     setTimeout(() => {
        //       this.tbservice.showHideTabs({ url: window.location.href });
        //     });
        //   } else {
            this.tbservice.showHideTabs(event);
        //   }
        } catch (error) {
          console.log(`${JSON.stringify(error)}`);
        }
        setTimeout(() => this.setPageTitle(), 1000);
        // if (!this.isSkip) {

        // }
      }
    });

    location.onUrlChange((url, state) => {
      if (!this.urlChanging) this._queryParams = {}; // 浏览器状态的返回,清空内存中的参数
    });
  }

  // 按页面的 pathname 来缓存URL 参数
  setCacheQueryParams(params) {
    if (params) {
      const oldParams = this.getAllCacheQueryParams();
      const newPrams = Object.keys(oldParams).reduce((obj, key) => {
        const isCached = this.cacheList.some((item) => item.url.startsWith(key));
        if (isCached) obj[key] = oldParams[key];
        return obj;
      }, {});
      newPrams[this.currentShortUrl] = params;
      localStorage.setItem(QUERY_PARAMS_STRING, JSON.stringify(newPrams));
    }
  }
  // 获取当前页面参数
  getCacheQueryParams() {
    const allParams = this.getAllCacheQueryParams();
    return allParams[this.currentShortUrl] || {};
  }
  // 获取所有的页面参数
  getAllCacheQueryParams() {
    const jsonStr = localStorage.getItem(QUERY_PARAMS_STRING);
    if (jsonStr && jsonStr !== 'undefined' && jsonStr !== 'null' && jsonStr !== '{}') {
      return JSON.parse(jsonStr);
    }
    return {};
  }
  deCodeUrl(params) {
    return Object.keys(params).reduce((obj, key) => {
      obj[key] = decodeURIComponent(params[key]);
      return obj;
    }, {});
  }

  /**
   * 跳转前加入动画参数
   */
  private commonNavigate(url: string | UrlTree | any[], options: VxNavigationOptions) {
    if (options.direction === 'forward') return this.navCtrl.navigateForward(url, options);
    if (options.direction === 'back') return this.navCtrl.navigateBack(url, options);
    if (options.direction === 'root') return this.navCtrl.navigateRoot(url, options);
    return Array.isArray(url)
      ? this.router.navigate(url, options)
      : this.router.navigate([url], options);
  }

  /**
   * @param extras 与 this.router.navigate 的参数唯一区别是增加了 direction 表示动画方向,默认为前进
   */
  resetExtras(extras?: VxNavigationOptions) {
    const { queryParams, stringQuery } = splitQueryParams(extras ? extras.queryParams : {});
    this._queryParams = queryParams; // 将参数放入 vxRoute的内存中
    const direction: any = 'forward';
    return { direction, ...extras, queryParams: stringQuery };
  }

  /**
   *  复现 router 的路由功能 , 保留特殊的 queryParams 类型
   * @param url: string | UrlTree
   * @param extras : NavigationExtras
   */
  async navigateByUrl(url: string | UrlTree, extras?: VxNavigationOptions): Promise<boolean> {
    this.urlChanging = true;
    const success = await this.commonNavigate([url], this.resetExtras(extras));
    this.queryParams = this._queryParams; // 将参数放入 localStorage 中
    this.urlChanging = false;
    return success;
  }

  async navigate(commands: any[], extras?: VxNavigationOptions): Promise<boolean> {
    this.urlChanging = true;
    const success = await this.commonNavigate(commands, this.resetExtras(extras));
    this.queryParams = this._queryParams; // 将参数放入 localStorage 中
    this.urlChanging = false;
    return success;
  }

//   back(queryParams?) {
//     this.location.back();
//     if (queryParams) {
//       this.navEnd$.pipe(take(1)).subscribe(() => {
//         this.queryParams = { ...this.getCacheQueryParams(), ...queryParams }; // 页面跳转完成,将返回的参数放入当前路由参数中
//       });
//     }
//   }

//   forward(queryParams?) {
//     this.location.forward();
//     if (queryParams) {
//       this.navEnd$.pipe(take(1)).subscribe(() => {
//         this.queryParams = { ...this.getCacheQueryParams(), ...queryParams }; // 页面跳转完成,将返回的参数放入当前路由参数中
//       });
//     }
//   }

  /**
   *  缓存历史 route
   * @param item:ICacheRoute
   */
  cacheRoute(item: ICacheRoute) {
    this.cacheList.push(item);
    this.cacheList = this.cacheList.slice(-this.cacheCount);
  }

  /**
   *  从浏览器返回到指定历史 route
   * @param item:ICacheRoute
   */
  cacheBackRoute(item: ICacheRoute) {
    let index = -1;
    this.cacheList.forEach((subItem, i) => {
      if (subItem.url === item.url) index = i;
    });
    if (index >= 0) {
      this.cacheList = this.cacheList.slice(0, index + 1);
    } else {
      this.cacheRoute(item);
    }
  }

  /**
   * 是否是跳出的路径
   */
//   isSkipPath(url: string) {
//     const lowerUrl = url.toLocaleLowerCase();
//     return this.skipPath.some((path) => path === lowerUrl);
//   }

  /**
   * 设置页面title
   */
  setPageTitle() {
    try {
      // const routerOutlet = (this.navCtrl as any).topOutlet;
      // if (routerOutlet) {
      //   const stackId = routerOutlet.getActiveStackId();
      //   const lastView = routerOutlet.getLastRouteView(stackId);
      //   if (lastView) {
      //     const title = lastView.element.querySelector('ion-title');

      //     if (title) {
      //       if (this.appPlatformService.setTitle) {
      //         this.appPlatformService.setTitle(title.innerText);
      //       }
      //     }
      //   }
      // }
    } catch (error) {
      console.log('setPageTitle', `${JSON.stringify(error)}`);
    }
  }

  /**
   * ionic路由:移除历史记录中所有需要跳过的路由
   */
//   removeHistorySkipPath() {
//     const views = (this.navCtrl as any).topOutlet.stackCtrl.views;
//     this.skipPath.forEach((path) => {
//       const index = views.findIndex((item) =>
//         item.url.toLowerCase().replace(/\/$/, '').endsWith(path),
//       );
//       if (index >= 0 && index !== views.length - 1) views.splice(index, 1);
//     });
//   }

  /**
   *  ionic路由:根据 url 返回到指定的历史记录,应优先使用此方法,而不是removeRouteViewByUrl;
   * @param url 返回的链接
   * @param force 如果历史记录没找到,是否跳转到url
   */
//   async backRouteViewByUrl(url: string, force = true): Promise<boolean> {
//     if (this.platform.is('cordova')) {
//       const views = (this.navCtrl as any).topOutlet.stackCtrl.views;
//       const clearUrl = url.replace(/\/$/, '');
//       const index = views.findIndex((item) => item.url.indexOf(clearUrl) > -1);
//       if (index >= 0 && index !== views.length - 1) {
//         const backIndex = views.length - index - 1;
//         const isSuccess = await (this.navCtrl as any).topOutlet.pop(backIndex);
//         if (!isSuccess && force) return this.navCtrl.navigateBack(url);
//         else return isSuccess;
//       }
//     } else {
//       const subUrl = url.replace(/\/$/, ''); // 去掉后缀
//       let curIndex = -1;
//       this.cacheList.forEach((subItem, i) => {
//         const itemUrl = shortUrl(subItem.url);
//         if (itemUrl === subUrl) curIndex = i;
//       });
//       if (curIndex >= 0) {
//         history.go(-(this.cacheList.length - curIndex - 1));
//       } else if (force) return this.navCtrl.navigateBack(url);
//       return false;
//     }
//   }

  /**
   * ionic路由:通过删除历史记录中的页面,返回 false 则没有找到
   * @param url 要删除的记录的页面
   */
//   removeRouteViewByUrl(url: string): boolean {
//     const views = (this.navCtrl as any).topOutlet.stackCtrl.views;
//     const clearUrl = url.replace(/\/$/, '');
//     const index = views.findIndex((item) => item.url.indexOf(clearUrl) > -1);
//     if (index >= 0 && index !== views.length - 1) {
//       views.splice(index, 1);
//       return true;
//     } else return false;
//   }

  /**
   * 是否跳出的routeId
   * @param id roterid
   */
  isSkipRouteId(id: number) {
    // if ('cordova' === this.helper.environment) return false;
    const key = this.formatRouterKey(id);
    // 如果当前历史路由id 在跳过路由ids里 不能返回。
    return this.skipRouteIds[key];
  }

  /**
   * 设置当前页面不可返回
   */
  setSkip() {
    const key = this.formatRouterKey(this.currentRouteId);
    this.skipRouteIds[key] = true;
    // console.log('this.skipRouteIds ', this.skipRouteIds);
  }

  /**
   * 设置当前页面不可返回(ngDestroy内调用)
   * 需要和 setTempSkip 配合使用:
   *   ionViewDidEnter() {
   *      this.vxRouter.setTempSkip();
   *   }
   *   ngOnDestroy() {
   *    this.vxRouter.setSkipByDestroy();
   *   }   *
   *
   * @param sub skipTempRouteIds内的倒数第几位 默认值2
   */
//   setSkipByDestroy(sub = 2) {
//     // 缓存跳过A
//     const tempLength = this.skipTempRouteIds.length;
//     if (!tempLength || sub >= tempLength) return;

//     const key = this.skipTempRouteIds[tempLength - sub];
//     this.skipRouteIds[key] = true;
//   }

  /**
   * 当页面前路由ID加入 tempSkip里
   *  用于当前页面
   *  可以从上一个页面正常退回显示。执行操作后禁止返回。
   *  A页面跳转B页面、 B页面执行完逻辑 A、B 都不能返回时。
   *
   */
//   setTempSkip() {
//     const key = this.formatRouterKey(this.currentRouteId);
//     this.skipTempRouteIds.push(key);
//   }

  /**
   * 删除一个缓存需要跳过的路由（默认为当前路由）
   * @param routerid 路由id
   */
//   delSingleTempKip(routerid?) {
//     if (0 !== routerid && !routerid) {
//       routerid = this.currentRouteId;
//     }
//     const delKey = this.formatRouterKey(routerid);
//     const newArr = this.skipTempRouteIds.filter((item) => delKey !== item);
//     this.skipTempRouteIds = newArr;
//   }

  /**
   * 清空TempSkip
   */
//   clearTempSkip() {
//     this.skipTempRouteIds = [];
//   }

  /**
   * 根据id生成Key
   */
  formatRouterKey(routerid: number) {
    return `①${routerid}①,`;
  }

  /**
   * tempSkip里的跳过路由
   *
   */
//   setTempSkipToTakeEffect() {
//     cloneDeep(this.skipTempRouteIds).map((key) => {
//       this.skipRouteIds[key] = true;
//     });
//     this.clearTempSkip();
//   }

  /**
   * 根据平台 返回。
   */
//   pageBack() {
//     // app用 navactrl.pop()
//     if ('cordova' === this.helper.environment) {
//       console.log('back');
//       this.navCtrl.pop();
//       return;
//     }
//     console.log('loacationBack');
//     this.location.back();
//   }

//   alert(str) {
//     const isShowAlert = this.helper.isShowAlert;
//     if (isShowAlert) alert(str);
//   }
}
