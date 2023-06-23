import { ComponentFixture, TestBed } from '@angular/core/testing';
import { verticalToolbarWidth } from '../layout.constant';

import { PageWithToolbarLayoutComponent } from './page-with-toolbar-layout.component';

describe('PageWithToolbarLayoutComponent', () => {
  let component: PageWithToolbarLayoutComponent;
  let fixture: ComponentFixture<PageWithToolbarLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageWithToolbarLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageWithToolbarLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('toolbarStyle', () => {
    it('should return toolbar style', () => {
      expect(component.toolbarStyle).toEqual({
        flex: `1 1 ${verticalToolbarWidth}`,
        'box-sizing': 'border-box',
        'max-width': `${verticalToolbarWidth}`,
        'min-width': `${verticalToolbarWidth}`,
      });
    });
  });
});
