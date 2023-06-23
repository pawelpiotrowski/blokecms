import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationFormToolbarComponent } from './navigation-form-toolbar.component';

describe('NavigationFormToolbarComponent', () => {
  let component: NavigationFormToolbarComponent;
  let fixture: ComponentFixture<NavigationFormToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationFormToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationFormToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('addNewExternalLink', () => {
    it('should set addNew property with external link object', () => {
      component.addNewExternalLink();
      expect(component.addNew).toEqual({
        label: '',
        index: -1,
        url: '',
      });
    });
  });

  describe('addNewInternalLink', () => {
    it('should set addNew property with interal link object', () => {
      component.addNewInternalLink();
      expect(component.addNew).toEqual({
        label: '',
        index: -1,
        pageId: '',
      });
    });
  });

  describe('cancelAddNew', () => {
    it('should set addNew property to null', () => {
      component.addNewInternalLink();
      expect(component.addNew).not.toBeNull();
      component.cancelAddNew();
      expect(component.addNew).toBeNull();
    });
  });

  describe('linkAddHandler', () => {
    it('should emit the link and call cancelAddNew', () => {
      jest.spyOn(component.addNewLink, 'emit');
      jest.spyOn(component, 'cancelAddNew');
      const mockAddLink = {
        label: 'Hello',
        slug: 'foo',
        index: -1,
      };

      component.linkAddHandler(mockAddLink);
      expect(component.addNewLink.emit).toHaveBeenLastCalledWith(mockAddLink);
      expect(component.cancelAddNew).toHaveBeenCalled();
    });
  });
});
