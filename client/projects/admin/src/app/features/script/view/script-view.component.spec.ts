import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScriptViewComponent } from './script-view.component';

describe('ScriptViewComponent', () => {
  let component: ScriptViewComponent;
  let fixture: ComponentFixture<ScriptViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScriptViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScriptViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
