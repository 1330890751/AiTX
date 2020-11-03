import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
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

// import { VxRouteService } from '@core/vx-route.service';

type uploadStatus = 'error' | 'done' | 'uploading' | 'pendding' | 'downloading' | 'downloaded';

interface IUploadFile {
  lastModified: string; // 最后修改时间
  fileName: string; // 文件名称
  size: string; // 文件尺寸
  sizeb: string; // 文件尺寸 b字节
  downloadUrl?: string; // 下载url
  percent?: number; // 上传进度
  id?: string;
  status?: uploadStatus;
  originFileObj?: File; // 上传对象
  icon?: string;
  fileMIMEType?: string;
  filePath?: string;
  isPic?: boolean;
}
@Component({
  selector: 'position-mail-page',
  templateUrl: 'main.html',
  styleUrls: ['main.scss'],
})
export class MailPage implements OnInit, OnDestroy {
  initlized = false;
  fileList: IUploadFile[] = [];

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
    if (this.initlized) return;
    this.initlized = true;
  }

  ionViewWillEnter() {}

  ionViewWillLeave() { }
  goPage(page){
    // this.router.navigate(['/tabs/tab3/'+ page]);
    this.utilityComp.navForwardByPath('/tabs/tab3/' + page);
  }
  ngOnDestroy() {}
  addFile() {
    // if (this.config.readonly) return;
    this.fileInput.nativeElement.click();
  }
  onFileChange(event) {
    const files = event.target.files;
    console.log(files[0]);
    const fileObj = this.createUploadFileByFile(files[0]);
    console.log(fileObj);
    if (fileObj) {
      console.log(`${JSON.stringify(files)}`);
      this.fileList.push(fileObj);
      this.startUpload(fileObj);
      debugger
    }
  }
  startUpload(uploadFile: IUploadFile) {
    console.log('start upload...');
    console.log(uploadFile.originFileObj);
    uploadFile.status = 'uploading';
    // const serverUrl = `${this.helper.getAPI('UploadFiles')}`;
    const serverUrl = `UploadFiles`;
    const formData = new FormData();
    formData.append('file', uploadFile.originFileObj);
    formData.append('fileName', uploadFile.fileName);
    formData.append('fileMimiType', uploadFile.fileMIMEType);
    formData.append('fileSize', uploadFile.size);
    formData.append('userid', '0');
    let lang = window.localStorage.getItem('AppLanguage') || 'zh-cn';
    if (lang === 'en-gb') lang = 'en';

    // const sourceType = SourceType[this.helper.environment] || 0;
    const sourceType = '0';
    const req = new HttpRequest('POST', serverUrl, formData, {
      reportProgress: true,
      headers: new HttpHeaders({
        Accept: '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        version: this.authService.helper.appVersion,
        language: lang,
        sourcetype: sourceType,
        expertphone: this.authService.userInfo.expertphone || '',
        auth: this.authService.userInfo.auth || '',
      }),
    });
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

  createUploadFileByFile(file: any) {
    if (file) {
      const uploadFile: IUploadFile = {
        lastModified: this.transformLastModifedTime(file.lastModified),
        fileName: file.name,
        status: 'uploading',
        originFileObj: file,
        fileMIMEType: file.type || '',
        isPic: this.checkisImage(file.name),
        icon: this.transformImageFileIcon(file.name),
        size: this.transformFileSize(file.size),
        sizeb: file.size,
      };
      return uploadFile;
    }
    return null;
  }
  checkisImage(fileName) {
    const imageExts = ['jpg', 'jpeg', 'png', 'gif'];
    let fileExt = fileName.substr(fileName.lastIndexOf('.') + 1);
    fileExt = fileExt.toLowerCase();
    let ret = false;
    imageExts.forEach((item) => {
      if (fileExt.indexOf(item) >= 0) {
        ret = true;
      }
    });
    return ret;
  }
  transformLastModifedTime(lastModified) {
    let ret = '';
    try {
      ret = moment().format('YYYY-MM-DD HH:mm');
    } catch (err) {}
    return ret;
  }

  transformImageFileIcon(fileName) {
    const imageExts = ['jpg', 'jpeg', 'png', 'gif'];
    const documentExts = ['doc', 'docx', 'pdf', 'xlsx', 'txt'];
    const zipExts = ['zip', 'rar'];
    let fileExt = fileName.substr(fileName.lastIndexOf('.') + 1);
    fileExt = fileExt.toLowerCase();
    const isPic = imageExts.some((item) => {
      return item.indexOf(fileExt) >= 0;
    });
    const isZip = zipExts.some((item) => {
      return item.indexOf(fileExt) >= 0;
    });
    const isDoc = documentExts.some((item) => {
      return item.indexOf(fileExt) >= 0;
    });
    if (isPic) {
      return 'assets/img/picture@2x.png';
    } else if (isZip) {
      return 'assets/img/zip@2x.png';
    } else if (isDoc) {
      return 'assets/img/wendang@2x.png';
    }
    return 'assets/img/unknow@2x.png';
  }

  transformFileSize(byte: any) {
    const kb = byte / 1024;
    let mb;
    if (kb > 1024) {
      mb = kb / 1024;
    }

    const result = mb ? mb : kb;
    const fix = mb ? 'MB' : 'KB';

    return parseFloat(result).toFixed(3) + fix;
  }
}
