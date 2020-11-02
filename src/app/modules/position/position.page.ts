import { Component } from '@angular/core';
import { _HttpClient } from '@core/net/http.client';

@Component({
  selector: 'app-position',
  templateUrl: 'position.page.html',
  styleUrls: ['position.page.scss'],
})
export class PositionPage {
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
