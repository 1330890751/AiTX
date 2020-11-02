import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from 'src/app/modules/explore-container/explore-container.module';

import { PositionPage } from '@app/modules/position/position.page';

describe('PositionPage', () => {
  let component: PositionPage;
  let fixture: ComponentFixture<PositionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PositionPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PositionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
