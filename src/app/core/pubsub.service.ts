/**
 * 全集通知事件
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
class PubSubEvent extends Subject<any> {
  constructor() {
    super();
  }
  emit(value) {
    super.next(value);
  }
}
@Injectable({
  providedIn: 'root',
})
export class PubSubService {
  beforeRequest: PubSubEvent;
  afterRequest: PubSubEvent;
  errorToast: PubSubEvent;
  errorToastLan: PubSubEvent;
  noNetworkError: PubSubEvent;
  successToast: PubSubEvent;
  showPupup: PubSubEvent;
  hidePupup: PubSubEvent;
  confirm: PubSubEvent;
  errorSso: PubSubEvent;
  trialExpiredError: PubSubEvent;
  constructor() {
    this.beforeRequest = new PubSubEvent();
    this.afterRequest = new PubSubEvent();
    this.errorToast = new PubSubEvent();
    this.errorToastLan = new PubSubEvent();
    this.noNetworkError = new PubSubEvent();
    this.successToast = new PubSubEvent();
    this.showPupup = new PubSubEvent();
    this.hidePupup = new PubSubEvent();
    this.confirm = new PubSubEvent();
    this.errorSso = new PubSubEvent();
    this.trialExpiredError = new PubSubEvent();
  }
}
