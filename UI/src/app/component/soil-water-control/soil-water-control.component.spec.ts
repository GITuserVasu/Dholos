import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoilWaterControlComponent } from './soil-water-control.component';

describe('SoilWaterControlComponent', () => {
  let component: SoilWaterControlComponent;
  let fixture: ComponentFixture<SoilWaterControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoilWaterControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoilWaterControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
