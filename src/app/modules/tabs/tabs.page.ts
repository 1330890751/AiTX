import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor() {}
  tabDatas = [
    {
      tab: 'position',
      iconIo: 'ellipse',
      icon: 'vx-position',
      label: '职位',
    },
    {
      tab: 'me',
      iconIo: 'square',
      icon: 'vx-me',
      label: '我的',
    },
    {
      tab: 'tab3',
      iconIo: 'square',
      icon: 'vx-contacts',
      label: 'tab3',
    }
  ];
}
