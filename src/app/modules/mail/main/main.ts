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
import {UtilityComponentService} from '@core/utils-component.service';

@Component({
  selector: 'position-mail-page',
  templateUrl: 'main.html',
  styleUrls: ['main.scss'],
})
export class MailPage implements OnInit {
  viewId = "";   // 编辑时传入
  initlized = false;
  readonly = false;  // 是否只读
  formValid = false;
  formData: any = {
      id: "",
      mail: "",
  };
  // 字段信息
  fieldInfo: any = {
    mail: {
        label: "邮箱",
        isRequire: true,
        errorMsg: "请输入{{field}}",
    }
  };

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
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
    public utilityComp: UtilityComponentService

    // private vxRouter: VxRouteService,
  ) {}
  ngOnInit() {}
  ionViewDidEnter() {
    if (!this.initlized) {
      this.initlized = true;
      this.getData();
    }
  }
  /**
   * 绑定load数据
   */
  getData() {
    if (this.viewId) {
      this.readonly = true;
      this.http.get(`/position/mail/`, {})
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
    const {...params } = rs;
    this.formData = params;
    // this.pageState = 1;
  }

  submitHandler() {
    this.checkFormFild();   // 必选项验证
    this.checkMail();   //邮箱验证
    if (!this.formValid) return;
    this.updateKeyResultsRestoreFn();
  }
  updateKeyResultsRestoreFn() {
    console.log(this.formData, "----this.formData--------");
    const parames = {
      id: this.formData.id ? this.formData.id : "",
      mail : this.formData.mail,
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

checkMail(){
  const { mail } = this.formData;
  const re=/^\w+@[a-z0-9]+\.[a-z]+$/i; 
  if (this.formValid && !re.test(mail)){
    this.utilityComp.presentToast("请输入正确的邮箱");
    this.formValid = false;
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

  startUpload(uploadFile) {
    this.http.post("/upload/mail", {}).subscribe((rs: any) => {
      alert("提交成功")
    });
  }
}
