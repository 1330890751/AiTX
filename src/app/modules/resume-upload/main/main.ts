import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NavController,
  Platform,
} from '@ionic/angular';
import { Events } from '@core/services/events.service';
import { AuthService } from '@core/auth.service';
// import { UtilityComponentService } from '@core/utils-component.service';
// import { ContactService } from '../../../core/services/contact.service';
import * as _ from 'lodash';
// import { VxRouteService } from '@core/vx-route.service';
@Component({
  selector: 'my-team-main-page',
  templateUrl: 'main.html',
  styleUrls: ['main.scss'],
})
export class ResumeUploadPage implements OnInit, OnDestroy {
  
  initlized = false;

  constructor(
    public activatedRoute: ActivatedRoute,
    // public contactService: ContactService,
    public navCtrl: NavController,
    public platform: Platform,
    // public utilityComp: UtilityComponentService,
    public el: ElementRef,
    public events: Events,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    // private vxRouter: VxRouteService,
  ) {
    
  }
  ngOnInit() {
    
  }
  
  ionViewDidEnter() {
    if (this.initlized) return;
    this.initlized = true;
  }

  ionViewWillEnter() {
  }

  ionViewWillLeave() {
    
  }

  ngOnDestroy() {
    
  }
}
