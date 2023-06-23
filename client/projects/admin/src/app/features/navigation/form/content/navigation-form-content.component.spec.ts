import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationFormContentComponent } from './navigation-form-content.component';

describe('NavigationFormContentComponent', () => {
  let component: NavigationFormContentComponent;
  let fixture: ComponentFixture<NavigationFormContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatExpansionModule, NoopAnimationsModule],
      declarations: [NavigationFormContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationFormContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('removeItem', () => {
    it('should remove item from content array', () => {
      component.content = [
        { pageId: '123', label: 'media' },
        { url: 'http://foo', label: 'text' },
      ];
      fixture.detectChanges();

      jest.spyOn(component.contentUpdate, 'emit');

      component.removeItem(component.content[0]);

      expect(component.contentUpdate.emit).toHaveBeenLastCalledWith([
        { url: 'http://foo', label: 'text' },
      ]);
    });
  });

  describe('addItem', () => {
    it('should add item to content array', () => {
      component.content = [
        { pageId: '123', label: 'media' },
        { url: 'http://foo', label: 'text' },
      ];
      fixture.detectChanges();

      jest.spyOn(component.contentUpdate, 'emit');

      const mockAddItem = { url: 'http://bar', label: 'foo', index: 0 };

      component.addItem(mockAddItem);

      expect(component.contentUpdate.emit).toHaveBeenLastCalledWith([
        { url: 'http://bar', label: 'foo' },
        { pageId: '123', label: 'media' },
        { url: 'http://foo', label: 'text' },
      ]);
    });
  });

  describe('updateItem', () => {
    it('should add item to content array', () => {
      component.content = [{ url: 'http://foo', label: 'text' }];
      fixture.detectChanges();

      jest.spyOn(component.contentUpdate, 'emit');

      const mockUpdateItem = {
        ...component.content[0],
        index: 0,
        label: 'Updated',
      };
      const { url, label } = mockUpdateItem;
      const expectedUpdateItem = { url, label };

      component.updateItem(mockUpdateItem);

      expect(component.contentUpdate.emit).toHaveBeenLastCalledWith([
        expectedUpdateItem,
      ]);
    });
  });

  describe('getAsLinkContent', () => {
    it('should return item extended with index', () => {
      component.content = [{ url: 'http://foo', label: 'text' }];
      fixture.detectChanges();

      expect(component.getAsLinkContent(component.content[0], 1)).toEqual({
        ...component.content[0],
        index: 1,
      });
    });
  });
});
