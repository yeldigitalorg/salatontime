import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextSalatTimeComponent } from './next-salat-time.component';

describe('NextSalatTimeComponent', () => {
  let component: NextSalatTimeComponent;
  let fixture: ComponentFixture<NextSalatTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextSalatTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextSalatTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
