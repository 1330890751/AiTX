import {
  AfterContentInit,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  Optional,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PickerController } from '@ionic/angular';

import { CityPickerColumn } from './city-picker.model';
import * as _ from 'lodash';

export const CITY_PICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => CityPickerComponent),
  multi: true,
};

@Component({
  selector: 'city-picker',
  template: `
    <div class="city-picker-text ion-float-right ion-text-end" style="margin-right: 20px;height: 100%;line-height: 45px;width
    :50%;overflow:hidden;">{{ _text }}</div>
  `,
  // styles: ['.item-cover{color:black;--background:#fff;--button-background-activated:#fff;}'],
  styleUrls: ['city-picker.scss'],
  providers: [CITY_PICKER_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    class: 'vx-city-picker',
  },
})
export class CityPickerComponent implements AfterContentInit, ControlValueAccessor {
  @HostBinding('class.city-picker-disabled') _disabled: any = false;
  _labelId = '';
  _text = '';
  _fn: any;
  _isOpen = false;
  _value: any;

  _provinceCol = 0;
  _cityCol = 0;
  _regionCol = 0;

  id: string;
  /**
   * @input {string} The text to display on the picker's cancel button. Default: `Cancel`.
   */
  @Input() cancelText = 'Cancel';

  /**
   * @input {string} The text to display on the picker's "Done" button. Default: `Done`.
   */
  @Input() doneText = 'Done';

  /**
   * @input {CityPickerColumn} city data
   */
  @Input() citiesData: CityPickerColumn[] = [];

  /**
   * @input {string} separate
   */
  @Input() separator = ' ';

  /**
   * 值检测方法
   * @input {Function} valueCheckHandler
   */
  @Input() valueCheckHandler: any;

  /**
   * @output {any} Emitted when the city selection has changed.
   */
  @Output() ionChange: EventEmitter<any> = new EventEmitter();

  /**
   * @output {any} Emitted when the city selection was cancelled.
   */
  @Output() ionCancel: EventEmitter<any> = new EventEmitter();

  constructor(@Optional() private _pickerCtrl: PickerController) {}

  @HostListener('click', ['$event'])
  _click(ev: UIEvent) {
    if (ev.detail === 0) {
      // do not continue if the click event came from a form submit
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    this.open();
  }

  @HostListener('keyup.space')
  _keyup() {
    if (!this._isOpen) {
      this.open();
    }
  }

  async open() {
    if (this._disabled) {
      return;
    }
    const picker: any = await this._pickerCtrl.create({
      buttons: [
        {
          text: this.cancelText,
          role: 'cancel',
        },
        {
          text: this.doneText,
          handler: (data: any) => {
            const result: boolean = this.valueCheckHandler(data, this.citiesData);
            if (result) {
              this.onChange(data);
              this.ionChange.emit(data);
            }
            return result;
          },
        },
      ],
      columns: this.generate(0, true),
      mode: 'ios',
    });
    picker.addEventListener('ionPickerColChange', async (event: any) => {
      const { selectedIndex, name } = event.detail;
      if ('province' !== name) return;
      picker.columns = this.generate(selectedIndex, false);
      picker.forceUpdate();
    });
    await picker.present();
  }

  /**
   * @selectedIndex 当前省份下标
   * @provinceIndex 省Index
   * @init 是否为点击打开
   */
  generate(provinceIndex = 0, init?) {
    let values = [];
    if (this._value) {
      values = this._value.toString().split(this.separator);
    }
    // // Add province data to picker
    const provincData = this.citiesData.map((province) => {
      return { text: province.name, value: province.code, disabled: false };
    });
    let provinceActiveIndex;
    if (init) {
      if (values.length > 0) {
        provinceActiveIndex = this.citiesData.findIndex((option) => {
          if (values[0]) {
            return option.name === values[0];
          }
        });
      } else {
        provinceActiveIndex = provinceIndex;
      }
    } else {
      provinceActiveIndex = provinceIndex;
    }
    const provinceCol: any = {
      name: 'province',
      selectedIndex: provinceActiveIndex,
      options: _.cloneDeep(provincData),
    };
    // Add city data to picker
    const cityColData = this.citiesData[provinceActiveIndex].children.map((city) => {
      return { text: city.name, value: city.code, disabled: false };
    });
    const cityIndex = !values[1]?0:cityColData.findIndex((option) => option.text === values[1]);
    const cityCol: any = {
      name: 'city',
      selectedIndex: cityIndex,
      options: _.cloneDeep(cityColData),
    };
    return [provinceCol, cityCol];
  }

  validate(picker: any) {
    const columns = picker.getColumns();
    const provinceCol = columns[0];
    const cityCol = columns[1];
    const regionCol = columns[2];

    if (cityCol && this._provinceCol !== provinceCol.selectedIndex) {
      cityCol.selectedIndex = 0;
      const cityColData = this.citiesData[provinceCol.selectedIndex].children;
      cityCol.options = cityColData.map((city) => {
        return { text: city.name, value: city.code, disabled: false };
      });
    }

    if (
      regionCol &&
      (this._cityCol !== cityCol.selectedIndex || this._provinceCol !== provinceCol.selectedIndex)
    ) {
      const regionData = this.citiesData[provinceCol.selectedIndex].children[cityCol.selectedIndex]
        .children;
      if (regionData) {
        regionCol.selectedIndex = 0;
        regionCol.options = regionData.map((city) => {
          return { text: city.name, value: city.code, disabled: false };
        });
        this._regionCol = regionCol.selectedIndex;
      }
    }
    this._provinceCol = provinceCol.selectedIndex;
    this._cityCol = cityCol.selectedIndex;
  }

  divyColumns(picker: any) {
    const pickerColumns = picker.getColumns();
    const columns: number[] = [];

    pickerColumns.forEach((col: any, i: any) => {
      columns.push(0);

      col.options.forEach((opt: any) => {
        if (opt.text.length > columns[i]) {
          columns[i] = opt.text.length;
        }
      });
    });

    if (columns.length === 2) {
      const width = Math.max(columns[0], columns[1]);
      pickerColumns[0].align = 'right';
      pickerColumns[1].align = 'left';
      pickerColumns[0].optionsWidth = pickerColumns[1].optionsWidth = `${width * 17}px`;
    } else if (columns.length === 3) {
      const width = Math.max(columns[0], columns[2]);
      pickerColumns[0].align = 'right';
      pickerColumns[1].columnWidth = `${columns[1] * 33}px`;
      pickerColumns[0].optionsWidth = pickerColumns[2].optionsWidth = `${width * 17}px`;
      pickerColumns[2].align = 'left';
    }
  }

  setValue(newData: any) {
    this._value = newData === null || newData === undefined ? '' : newData;
  }

  getValue(): string {
    return this._value;
  }

  checkHasValue(inputValue: any) {}

  updateText() {
    if (this._value) {
      this._text = this._value.toString().trim();
    }
  }

  /**
   * @input {boolean} Whether or not the multi picker component is disabled. Default `false`.
   */
  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(val: boolean) {
    this._disabled = val;
  }

  writeValue(val: any) {
    this.setValue(val);
    this.updateText();
    this.checkHasValue(val);
  }

  ngAfterContentInit() {
    this.updateText();
  }

  registerOnChange(fn: any): void {
    this._fn = fn;
    this.onChange = (val: any) => {
      this.setValue(this.getString(val));
      this.updateText();
      this.checkHasValue(val);

      fn(this._value);
      this.onTouched();
    };
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  onChange(val: any) {
    // onChange used when there is not an formControlName
    this.setValue(this.getString(val));
    this.updateText();
    this.checkHasValue(val);
    this.onTouched();
  }

  onTouched() {}

  getString(newData: any) {
    return newData.region
      ? `${newData.province.text}${this.separator}${newData.city.text || ''}${this.separator}${
          newData.region.text || ''
        }`
      : `${newData.province.text}${this.separator}${newData.city.text || ''}`;
  }
}
