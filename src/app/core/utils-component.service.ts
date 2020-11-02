import { Injectable } from '@angular/core';
import {
  ToastController,
  LoadingController,
  AlertController,
  PickerController,
  NavController,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { cloneDeep, groupBy, remove } from 'lodash';
import { Subject } from 'rxjs';
import {
  Event as NavigationEvent,
  ActivatedRoute,
  Router,
  NavigationExtras,
  UrlSerializer,
} from '@angular/router';
import { VxRouteService } from './vx-route.service';
import { first } from 'rxjs/operators';
import { Helper } from '@app/core/help.service';
import { Location } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class UtilityComponentService {
  loading: any;
  colorList = ['#ff776f', '#fbc02d', '#4fdebe', '#51c4ed'];
  public pageHandler: any; // 页面传参用Handler  Subject;
  public currentNavigationId = -1; // 当前页面navigation id
  public prevRoutePath = ''; // 上一页面路由
  public currentRoutePath = ''; // 当前页面路由

  // 下一页面参数  页面跳转参数传递;
  get queryParams() {
    return cloneDeep(this.vxRouter.queryParams || {});
  }

  public parentPage: any = {
    id: 0,
    parentRoutePath: '',
  };
  public loadingIsOpen: any = false;
  constructor(
    public navCtrl: NavController,
    public translateService: TranslateService,
    private toastCtrl: ToastController,
    public loadingController: LoadingController,
    public router: Router,
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
    public pickerController: PickerController,
    public vxRouter: VxRouteService,
    public helper: Helper,
    public location: Location,
    public serializer: UrlSerializer,
  ) {}
  /**
   * 弹出信息
   *
   * @param: {string} message     信息提示
   * @param:  {string} [position]  位置
   * @param: {number} [duration]  持续事件
   */
  async presentToast(msg: string, position?: 'top' | 'bottom' | 'middle', duration?: number) {
    position = position || 'bottom';
    duration = duration || 1500;
    const toast = await this.toastCtrl.create({
      color: 'dark',
      message: msg,
      position,
      duration,
      animated: true,
    });
    toast.present();
  }

  async presentLoading(val?) {
    this.loadingIsOpen = true;
    await this.loadingController
      .create({
        message: this.translateService.instant('MT.Please Wait'),
        spinner: 'crescent',
        duration: val ? 0 : 2000,
      })
      .then((rs) => {
        rs.present().then(() => {
          if (!this.loadingIsOpen) {
            rs.dismiss();
          }
        });
      });
  }
  /**
   * 弹出警告等提示
   */
  async presentAlter(params?) {
    if (!params) {
      params = {
        title: 'Alter',
        subTitle: '',
      };
    }
    const alert = await this.alertCtrl.create({
      header: params.title,
      subHeader: params.subTitle,
      buttons: ['OK'],
    });
    return alert.present();
  }

  /**
   * 确定/取消 提示
   */
  async alertPrompt(Message, handler?) {
    const prompt = await this.alertCtrl.create({
      header: this.translateService.instant('tips'),
      message: Message,
      buttons: [
        {
          text: this.translateService.instant('Cancel'),
          handler: (_data) => {
            if (handler) handler(false);
          },
        },
        {
          text: this.translateService.instant('Confirm'),
          handler: (_data) => {
            if (handler) handler(true);
          },
        },
      ],
    });
    await prompt.present();
  }

  /**
   * 关掉Loading
   */
  async dismissLoading() {
    if (this.loadingIsOpen) {
      this.loadingIsOpen = false;
      await this.loadingController.dismiss();

      // try {
      //   await this.loadingController.dismiss();
      // } catch (error) {
      //   console.log(`${JSON.stringify(error)}`);
      // }
    }
  }

  /**
   * 获取对应key的验证报错信息(...不能为空)
   */
  getRequiredTrans(templatekey, fieldkey) {
    return this.translateService.instant(templatekey, {
      field: this.translateService.instant(fieldkey),
    });
  }
  /**
   * 清除 pageHandler 订阅
   */
  clearPageHandler() {
    try {
      setTimeout(() => {
        if (this.pageHandler) {
          const { observers } = this.pageHandler;
          // 判断有在订阅
          if (observers && observers.length > 0) {
            this.pageHandler.unsubscribe();
          }

          this.pageHandler = null;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 打开picer 通用方法
   * @param pickValue   选中值
   * @param pickOptions 选中
   * @param callBack 回调参数
   */
  async showPickerCom(pickValue, pickOptions, callBack) {
    const selectedIndex = pickOptions.findIndex((item) => item.value === pickValue);
    const picker = await this.pickerController.create({
      buttons: [
        {
          text: this.translateService.instant('Cancel'),
          role: 'cancel',
        },
        {
          text: this.translateService.instant('Confirm'),
          handler: (data: any) => {
            try {
              if (callBack) callBack(data, picker);
            } catch (error) {}
          },
        },
      ],
      columns: [
        {
          name: 'item',
          align: 'center',
          options: cloneDeep(pickOptions),
          selectedIndex,
        },
      ],
      mode: 'ios',
    });
    picker.present();
  }
//   -----------start-------
  /**
   * 公用路由传参方法  path传参
   * @param path 路由
   * @param params 参数 object
   */
  async navForwardByPath(path = '', params: any = {}, extras?: NavigationExtras) {
    extras = extras || {};
    // 构造Observable对象
    extras.queryParams = params || {};
    return this.vxRouter.navigateByUrl(path, extras);
  }

  setOffsetHeight() {
    let topheight = 44;
    const contactHeader = document.getElementsByClassName('contactHeader');
    const headerEle: any = contactHeader ? contactHeader[contactHeader.length - 1] : {}; // app有多个页面，当前页面是最后一个
    if (headerEle) {
      topheight = headerEle.offsetHeight;
    }
    console.log('topHeight:' + topheight);
    return topheight;
  }
}
