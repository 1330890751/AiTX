import { Component } from '@angular/core';
import { _HttpClient } from '@core/net/http.client';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  constructor(public http: _HttpClient) {}
  ionViewDidEnter() {
    this.http
      .get('/target/list', {
        page_index: 1,
        page_size: 20,
        assess: '1',
      })
      .subscribe((res) => {
        console.log('res===', res);
      });
  }
}
