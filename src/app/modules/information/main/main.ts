import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NavController,
  Platform,
} from '@ionic/angular';
import { Events } from '@core/services/events.service';
import { AuthService } from '@core/auth.service';
// import { UtilityComponentService } from '@core/utils-component.service';
// import { ContactService } from '../../../core/services/contact.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { _HttpClient } from '@core/http.client';
import { UtilityComponentService } from '@core/utils-component.service';
// import { CityDataService } from '@core/city_data.service';

@Component({
  selector: 'positiion-information-page',
  templateUrl: 'main.html',
  styleUrls: ['main.scss'],
})
export class InforMationPage implements OnInit, OnDestroy {
  initlized = false;
  readonly = false;  // 是否只读
  private cityData: any[];
  formValid = false;
  formData: any = {
      id: "",
      name: "",
      age: "",
      phone: "",
      workingyear: "",
      exposition: "",
      workexperience: "",
      proexperience: "",
      excityId: "",
      excityIdName: "请选择",
  };
  // 字段信息
  fieldInfo: any = {
    name: {
        label: "姓名",
        isRequire: true,
        errorMsg: "请输入{{field}}",
    },
    age: {
        label: "年龄",
        isRequire: true,
        errorMsg: "请输入{{field}}",
    },
    phone: {
        label: "联系方式",
        isRequire: true,
        errorMsg: "请输入{{field}}",
    },
    workingyear: {
        label: "工作年限",
        isRequire: true,
        errorMsg: "请输入{{field}}",
    },
    exposition: {
        label: "期望工作职位",
        isRequire: true,
        errorMsg: "请输入{{field}}",
    },
    excityId: {
      label: "期望工作城市",
      isRequire: true
    },
    workexperience: {
      label: "工作经历",
      isRequire: false
    },
    proexperience: {
      label: "项目经历",
      isRequire: false
    },
  };
  // krid（编辑时传入）
  viewId = "";
  constructor(
    public activatedRoute: ActivatedRoute,
    // public contactService: ContactService,
    public navCtrl: NavController,
    public platform: Platform,
    // public utilityComp: UtilityComponentService,
    public el: ElementRef,
    public events: Events,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public http: _HttpClient,
    public utilityComp: UtilityComponentService,
    // public cityDataSerice: CityDataService,


    // private vxRouter: VxRouteService,
  ) {}
  ngOnInit() {}
  ionViewDidEnter() {
    if (!this.initlized) {
      this.initlized = true;
      this.getData();
      this.getCityData();
    }
  }
  HukouCheck = (data, cityData) => {
    const provinceIndex = cityData.findIndex((option) => option.name === data.province.text);
    let cityItem = null;
    if (provinceIndex !== -1) {
      cityItem = cityData[provinceIndex].children.find((option) => option.name === data.city.text);
    }
    if (cityItem && cityItem.pcode === data.province.value) {
      return true;
    } else {
      this.utilityComp.presentToast(
        "城市数据选择错误"
      //   this.translateService.instant('WFNew.Domicile Place Error', {
      //     field: this.fixedFieldNames.HukouLocation,
      //   }),
      );
      return false;
    }
  };
  cityChange(event) {
    if (event) {
      this.formData.HukouLocation = event.province.value + ',' + event.city.value;
      // this.afterRulsfieldChange('HukouLocation', this.formData.HukouLocation);
      //    this.formData.HukouLocation = event;
    } else {
      this.utilityComp.presentToast(
        "城市数据选择错误"
        // this.translateService.instant('WFNew.Domicile Place Error', {
        //   field: this.fixedFieldNames.HukouLocation,
        // }),
      );
    }
  }
  getCityData(){
    // this.cityDataSerice.getCitiesData().subscribe((data) => {
    //   this.cityData = data;
    // });
    this.http.get(`/citydata`, {})
      .subscribe(rs => {
        console.log(rs)
        this.cityData = _.cloneDeep(rs);
        // debugger
      });
  }
  /**
   * 绑定load数据
   */
  getData() {
    if (this.viewId) {
      this.readonly = true;
      this.http.get(`/position/information/`, {})
      .subscribe(rs => {
          this.bindLookFn(rs);
      });
      return;
    }
    // this.pageState = 1;
  }
  /**
   * 绑定look 数据
   * @param rs
   */
  bindLookFn(rs) {
    try {
        const { excity, ...params } = rs;
        this.formData = params;
        this.formData.excityIdName = excity.name;
        this.formData.excityId = excity.id;
    } catch (error) {}
    // this.pageState = 1;
  }

  submitHandler() {
    this.checkFormFild();
    if (!this.formValid) return;
    this.updateKeyResultsRestoreFn();
  }
  updateKeyResultsRestoreFn() {
    console.log(this.formData, "----this.formData--------");
    const parames = {
      id: this.formData.id ? this.formData.id : "",
      name : this.formData.name,
      age : this.formData.age,
      phone : this.formData.phone,
      workingyear : this.formData.workingyear,
      exposition : this.formData.exposition,
      excityId : this.formData.excityId,   // 城市id
      workexperience: this.formData.workexperience,
      proexperience: this.formData.proexperience
    };
    // if(parames.startTime - parames.endTime >0 ){
    //     this.utilityComp.presentToast('开始日期必须早于结束日期');
    //     return false;
    // }
    this.utilityComp.presentLoading();
    // 编辑
    if (this.viewId) {
        // this.http.put("/key-results", _.cloneDeep(parames)).subscribe((rs: any) => {
        //         history.back();
        // });

    }else{
        // this.http.post("/key-results", _.cloneDeep(parames)).subscribe((rs: any) => {
        //     history.back();
        // });
    }
}
  /**
   * 表单字段验证
   */
  checkFormFild() {
    console.log("forData", this.formData);
    // 字段必填验证。
    this.formValid = true;
    for (const key in this.formData) {
        if (this.formData.hasOwnProperty(key)) {
            const element = this.formData[key];
            const field = this.fieldInfo[key];
            // 字段判空。
            if (!element && field && field.isRequire) {
                let msg = field.errorMsg || "请选择{{field}}";
                msg = msg.replace("{{field}}", field.label);
                this.utilityComp.presentToast(msg);
                this.formValid = false;
                break;
            }
        }
    }
  }
  ionViewWillEnter() {}

  ionViewWillLeave() { }
  
  ngOnDestroy() {}

  startUpload(uploadFile) {
    this.http.post("/upload", {}).subscribe((rs: any) => {
      alert("提交成功")
    });
    // this.httpClient.request(req).subscribe(
    //   (event) => {
    //     // console.log(event)
    //     if (event.type === HttpEventType.UploadProgress) {
    //       const percentDone = Math.round((100 * event.loaded) / event.total);
    //       console.log(percentDone + '%');
    //       uploadFile.percent = percentDone;
    //     } else if (event instanceof HttpResponse) {
    //       const { errorCode, errorMsg, data } = event.body as any;
    //       console.log(event.body);
    //       if (String(errorCode) === '-1') {
    //         uploadFile.status = 'error';
    //         this.fileInput.nativeElement.value = '';
    //         console.error(errorMsg);
    //         this.utilityComp.presentToast(errorMsg);
    //       } else {
    //         uploadFile.status = 'done';
    //         this.fileInput.nativeElement.value = '';
    //         if (data) {
    //           uploadFile.downloadUrl = data.url;
    //           uploadFile.id = data.id;
    //         }
    //         this.syncFormValue();
    //       }
    //     }
    //   },
    //   (error) => {
    //     uploadFile.status = 'error';
    //     this.fileInput.nativeElement.value = '';
    //     this.utilityComp.presentToast('上传失败');
    //     console.error(error);
    //   },
    // );
  }

}
