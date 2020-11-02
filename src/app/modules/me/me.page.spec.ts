import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from 'src/app/modules/explore-container/explore-container.module';

import { MePage } from 'src/app/modules/me/me.page';

describe('Tab2Page', () => {
  let component: MePage;
  let fixture: ComponentFixture<MePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MePage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
