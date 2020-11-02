import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  showTabBarPages = ['tabs', 'home', 'workflow', 'contact', 'me'];
  constructor(private router: Router, private platform: Platform) {}

  public hideTabs() {
    const tabBar = document.getElementById('myTabBar');
    if (tabBar) {
      if (tabBar.style.display !== 'none') tabBar.style.display = 'none';
    }
  }

  public showTabs() {
    const tabBar = document.getElementById('myTabBar');
    if (tabBar) {
      if (tabBar.style.display !== 'flex') tabBar.style.display = 'flex';
    }
  }

  public navEvents() {}

  public showHideTabs(e: any) {
    const urlArray = e.url.split('/');
    const pageUrl = urlArray[urlArray.length - 1];
    // 通讯录兼容
    const page = pageUrl.split('?')[0] === 'defaultContact' ? 'contact' : pageUrl.split('?')[0];
    const shouldShow = this.showTabBarPages.indexOf(page) > -1 || e.url === '/';

    try {
      setTimeout(() => (shouldShow ? this.showTabs() : this.hideTabs()), 300);
    } catch (err) {}
  }
}
