import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// import Moment from 'moment'

@Component({
  selector: 'field-info-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['field-info-view.scss'],
  template: `
    <div class="knx-div-view-left">
      <span>{{ label }}</span
      ><span>：</span>
    </div>
    <div class="knx-div-view-right">
      {{ value }}
    </div>
  `,
})
export class FieldInfoViewComponent implements OnInit {
  label = '';
  value = '';
  isImage = false;
  imgurl = '';
  @Input() data: any = {};
  constructor(public translateService: TranslateService) {}

  ngOnInit() {
    this.label = this.data.fieldname;
    let value = this.data.defaultvalue;
    if (!value) value = '-';
    else if (this.data.dropdownitems && this.data.dropdownitems.length > 0) {
      if (value === '-1') {
        value = '';
      }
      if (this.data.selecttype === 'Multiple') {
        const strs = [];
        const nowvalue = `,${value},`;
        this.data.dropdownitems.map((item) => {
          if (nowvalue.indexOf(`,${item.DataValue},`) > -1) {
            strs.push(item.DataText);
          }
        });
        if (strs.length > 0) value = strs.join(',');
      } else {
        const nowvalue = this.data.dropdownitems.find((item) => item.DataValue === value);
        if (nowvalue) {
          value = nowvalue.DataText;
        }
      }
      this.value = value;
    }

    // value= Moment(value).format("YYYY/MM/DD");
    this.value = value;
  }
}
