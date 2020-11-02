/**
 * 页面状态组件
 * state      状态
 * img        图片
 * text       文字说明 I18n
 */
import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'vx-pagestate',
  styleUrls: ['vx-pagestate.scss'],
  template:
    '<ion-spinner *ngIf="state==0" name="lines"></ion-spinner><vx-nodata *ngIf="state==2" [display]="state==2" [imgType]="img" [msg]="text"></vx-nodata>',
})
export class VxPageStateComponent implements OnInit {
  // 页面状态 0请求中；1显示数据 ；2空数据
  @Input() state = 0;
  // 图片名称
  @Input() img = 'base';
  // 文本名称
  @Input() text = 'No Data';

  constructor(public translateService: TranslateService) {}

  ngOnInit() {}
}
