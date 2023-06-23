import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageWithChildDrawerLayoutComponent } from './page-with-child-drawer-layout.component';

describe('PageWithChildDrawerLayoutComponent', () => {
  let component: PageWithChildDrawerLayoutComponent;
  let fixture: ComponentFixture<PageWithChildDrawerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageWithChildDrawerLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageWithChildDrawerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
