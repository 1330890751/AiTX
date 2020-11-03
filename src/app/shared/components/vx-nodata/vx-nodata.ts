/**
 * 空数据组件
 * display=false 是否展现 -true 显示  默认false
 * imgimgType    图片类型  base 通用
 * msg       文字说明
 */
import {
  Component,
  OnChanges,
  SimpleChange,
  Input,
  Output,
  OnInit,
  EventEmitter,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'vx-nodata',
  styleUrls: ['vx-nodata.scss'],
  template:
    '<div *ngIf="display" class="nodata"><img src="{{displayImg}}"/><span >{{displayMsg | translate}}</span></div>',
})
export class VxNoDataComponent implements OnInit, OnChanges {
  @Input() display = false;
  @Input() imgType: string;
  @Input() msg: string;
  // 图片路径对象
  imgUrls: any = {
    base: 'assets/img/icon-nodata@2x.png',
    engagement: 'assets/img/icon-nodata@3x.png',
    salary1: 'assets/img/icon1.png',
    salary2: 'assets/img/icon2.png',
    ats: 'assets/img/nodata@2x.png',
  };
  displayImg = this.imgUrls.base; // 显示的图片路径 （默认为imgUrls.base）
  displayMsg = 'No Data';

  constructor(public translateService: TranslateService) {}

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes.msg && changes.msg.previousValue !== changes.msg.currentValue) {
      this.displayMsg = this.msg || this.displayMsg;
    }
    if (changes.imgType && changes.imgType.previousValue !== changes.imgType.currentValue) {
      this.displayImg = this.imgUrls[this.imgType] || this.imgUrls.base;
    }
  }
  ngOnInit() {}
}
