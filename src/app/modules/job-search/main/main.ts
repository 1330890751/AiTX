import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NavController,
  Platform,
  IonVirtualScroll,
  IonContent,
  IonSearchbar,
} from '@ionic/angular';
import { Events } from '@core/services/events.service';
import { AuthService } from '@core/auth.service';
import { UtilityComponentService } from '@core/utils-component.service';
// import { ContactService } from '../../../core/services/contact.service';
import { _HttpClient } from '@core/http.client';
import * as _ from 'lodash';
@Component({
  selector: 'my-team-main-page',
  templateUrl: 'main.html',
  styleUrls: ['main.scss'],
})
export class JobSearchPage implements OnInit, OnDestroy {
  jobExpand = true;
  spaceExpand = true;
  historyData = [{
    id: 0,
    text: "前端开发"
  }, {
    id: 1,
    text: "市场拓展经理"
  }];
  genreData = [{
    id: 0,
    text: "岗位类型XXX"
  }, {
    id: 1,
    text: "岗位类型XXX岗位类型abcd"
  }, {
    id: 2,
    text: "岗位类型XXX"
  }, {
    id: 3,
    text: "岗位类型abcd"
  }];
  rangeData = [{
    text1: "2-8",
    text2: "30%的选择"
  }, {
    text1: "8-12",
    text2: "60%的选择"
  },{
    text1: "15以上",
    text2: "10%的选择"
  }];
  hotCity = [{
    id: 0,
    text: "北京"
  }, {
    id: 1,
    text: "上海"
  }, {
    id: 2,
    text: "杭州"
  }];
  @ViewChild(IonSearchbar, { static: false }) searchbar: IonSearchbar;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild(IonVirtualScroll, { static: false }) virtualScroll: IonVirtualScroll;
  topHeight = 0;
  bottomHeight = 0;
  routeSub = null;
  pageState = 0;
  bufferRatio = 3;
  pickupItem: any;
  // 接口额外参数
  extraparam: any;
  // 通讯录数据列表
  contactList = [];
  // 默认通讯录 overtime=加班   vacation=休假   busiTrip=公出   attendance=考勤  lplan=学习行动计划
  type = '';
  // 单选和多选类型 single or multiple
  mode = '';
  // 标题
  title = '';
  // 默认选中id
  ids: any = [];
  // 传入参数
  parentParams: any = {};
  selectedEmpMap = {};

  // 是否允许选择自己
  // allowSelectSelf = false;
  // 已经选中的人数
  // selectedNum = 0;
  selectedList = [];
  logInHandler;
  initlized = false;
  indexShow = false;
  // 来源
  source = '';
  constructor(
    public activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public platform: Platform,
    public utilityComp: UtilityComponentService,
    // private navParams: NavParams,
    // public viewCtrl: ViewController,
    public el: ElementRef,
    public events: Events,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public http: _HttpClient
  ) {
    this.parentParams = this.utilityComp.queryParams;
  }
  ngOnInit() {
    let sentparm = this.navParams('sentparm');
    if ('string' === typeof sentparm) sentparm = JSON.parse(this.navParams('sentparm'));
    this.extraparam = sentparm;
    this.type = this.activatedRoute.snapshot.params.type || '';
    // this.type = this.navParams("type") || ""
    this.title = this.navParams('title') || '';
    // this.mode = this.navParams('mode') || 'single';
    this.ids = this.navParams('ids') ? this.navParams('ids').split(',') : [];

    this.source = this.navParams('source') || null;
    if (this.platform.is('android')) {
      this.bufferRatio = 30;
    }
    /**
     * 如果 type 为空 或者类型为考勤或者学习行动计划则 不显示 XXX的审核页面功能
     */
    const noneArray = [
      'wfCustom',
      'underlingAttendance',
      'attendance',
      'lplan',
      'wfempselect',
      'induct',
      'resign',
      'positive',
      'mentor',
      'tdevelop',
      'wfnewnextstepsnew',
      'wfnewnextstepsnew831',
      'reporter',
      'entrynewreporter',
      'wfempfiedsalary',
      'parttimepsition',
    ];
    if (!this.navParams('defaultContact') && !this.type) {
      this.type = 'cc'; // 审核人和抄送人单独调用接口
    }
  }
  toggleExpand(type){
    this[type] = ! this[type];
  }
  setIndexHeight() {
    const tabBar = document.getElementById('myTabBar');
    if (tabBar) {
      tabBar.style.display !== 'none'
        ? (this.bottomHeight = tabBar.offsetHeight)
        : (this.bottomHeight = 0);
    }
    this.topHeight = 100;
    setTimeout(() => {
      this.topHeight = this.utilityComp.setOffsetHeight();
      this.indexShow = true;
    });
  }
  ionViewDidEnter() {
    this.setIndexHeight();
    if (this.initlized) return;
    this.loadContactData();
    this.initlized = true;
  }

  ionViewWillEnter() {
  }

  ionViewWillLeave() {
    this.searchbar.value = '';
    this.initlized = false;
    if (this.platform.is('ios')) this.indexShow = false;
  }

  ngOnDestroy() {
    this.indexShow = false;
    this.contactList = [];
    this.utilityComp.clearPageHandler();
  }

  // 读取父页面传入参数方法
  navParams(key): any {
    this.parentParams = this.parentParams || {};
    return this.parentParams[key];
  }
  /*** 加载数据** @memberof ContactPage*/
  loadContactData() {
    if (this.mode || this.type) {
      // 是单独页面
      this.bottomHeight = 0;
    }
    let type = this.type;
    if (type === 'underlingAttendance') {
      type = 'attendance';
    }
    this.http.get("/city/list", {}).subscribe((rs: any) => {
      const result = rs ? rs : [];
      const clone = this.formatContactData(false, result);
      // this.setOffset(clone);
      this.contactList = clone;
      this.pageState = this.contactList.length > 0 ? 1 : 2;
     });
  }

  /**
   * 格式化通讯录数据
   */
  private formatContactData(filter, data) {
    const contacts = [];
    const list = data;
    console.log(data);
    for (let i = 0; i < list.length; i++) {
      const group = list[i].name;
      const citys = list[i].citys;
      const listItem = this.utilityComp.spArr(citys,3);
      for (let j = 0; j < listItem.length; j++) {
        listItem[j].group = j !== 0 ? '' : _.cloneDeep(group);
        listItem[j].spcitys = _.cloneDeep(listItem[j]);
        contacts.push(listItem[j]);
      }
    }
    return contacts;
  }
  setOffset(contacts) {
    contacts.forEach((item, index) => {
      // 分组为空时使其有空的分组名
      if (!item.Initial) {
        item.Initial = item.group = ' ';
      }
      const prevItem = contacts[index - 1];
      if (index > 0) {
        item.offsetY = prevItem.offsetY + 70; // item height
        if (prevItem.Initial !== item.Initial && !item.group) {
          item.group = item.Initial;
        }
        if (prevItem.Initial === item.group) {
          item.group = '';
        }
        if (item.group && item.group !== '') {
          item.offsetY += 40; // header height
        }
      } else {
        item.offsetY = 0;
        if (!item.group) {
          item.group = item.Initial;
        }
        item.offsetY += 40; // header height
      }
    });
  }

  /*** 设置右边快速定位列表里头部** @param {any} record* @param {any} recordIndex* @param {any} records* @returns* @memberof ContactPage*/
  myHeaderFn(record, recordIndex, records) {
    if (record.group) {
      return record.group;
    }
    return null;
  }

  /*** 设置右边快速定位列表里底部** * @param {any} record* @param {any} recordIndex* @param {any} records* @returns* @memberof ContactPage*/
  myFooterFn(record, recordIndex, records) {
    return null;
  }

  trackBy(index, data) {
    return data.empId;
  }

  /**
   * 设置右边快速定位列表的点击** @param {string} letter * @memberof ContactPage
   */
  scrollToIndex(letter: string) {
    const group = _.find(this.contactList, (item) => {
      return item.group === letter;
    });
    if (group) {
      const scrollHeight = group.offsetY - 40;
      this.content.scrollToPoint(0, scrollHeight, 1).then(() => {
        this.virtualScroll.checkRange(this.contactList.indexOf(group));
      });
    }
  }

  searchInputFocusout(e) {
    // 防止 ios 弹出层重复弹出
    setTimeout(() => e.target.blur(), 20);
  }

  /**
   * 根据输入查询匹配项* @param {*} 输入参数
   */
  filterItems(ev: any) {
    console.log(this.contactList)
    // const val = ev.target.value;
    // let filterList;
    // if (val && val.trim() !== '') {
    //   filterList = this.contactService.contactList.filter((item) => {
    //     return (
    //       item.empCode.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
    //       item.userName.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
    //       item.depart.toLowerCase().indexOf(val.toLowerCase()) > -1
    //     );
    //   });
    // } else {
    //   filterList = this.contactService.contactList;
    // }
    // filterList.forEach((item) => {
    //   if (this.selectedEmpMap[item.empId]) {
    //     item.selected = true;
    //   }
    // });
    // this.setOffset(filterList);
    // this.contactList = filterList;
    // debugger
    this.content.scrollToTop(0);
    this.virtualScroll.checkRange(0);
  }

  /*** 点击行数据** @param {*} item* @returns* @memberof ContactPage*/
  cityClick(item: any) {
    console.log("点击了city")
  }

  /***  点击行数据* @param {*} item* @memberof ContactPage*/
  itemSelectedM(item: any) {
    this.selectedEmpMap[item.empId] = item.selected;
    alert("点击行数据")
  }
}
