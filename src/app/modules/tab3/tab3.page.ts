import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {UtilityComponentService} from '@core/utils-component.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
    public routerinfo: ActivatedRoute,
    public router: Router,
    public utilityComp: UtilityComponentService
    ) {}
  goPage(page){
    // this.router.navigate(['/tabs/tab3/'+ page]);
    this.utilityComp.navForwardByPath('/tabs/tab3/' + page);
  }
}
