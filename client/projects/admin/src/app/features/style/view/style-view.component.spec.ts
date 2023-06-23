import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleViewComponent } from './style-view.component';

describe('StyleViewComponent', () => {
  let component: StyleViewComponent;
  let fixture: ComponentFixture<StyleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StyleViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StyleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
