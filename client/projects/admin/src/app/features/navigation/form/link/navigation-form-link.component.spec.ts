import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NavigationFormLinkComponent } from './navigation-form-link.component';

describe('NavigationFormLinkComponent', () => {
  let component: NavigationFormLinkComponent;
  let fixture: ComponentFixture<NavigationFormLinkComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [NavigationFormLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationFormLinkComponent);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
  });

  describe('ngOnChanges', () => {
    it('should set link form when "activated" input is set to false ignoring first change', () => {
      const fbSpy = jest.spyOn(formBuilder, 'group');

      component.ngOnChanges({});
      expect(fbSpy).not.toHaveBeenCalled();
      component.ngOnChanges({
        activated: {
          firstChange: true,
          isFirstChange: jest.fn(),
          previousValue: undefined,
          currentValue: false,
        },
      });
      expect(fbSpy).not.toHaveBeenCalled();

      // this is first call to set link form from on init hook
      component.activated = false;
      fixture.detectChanges();
      component.linkForm.markAsDirty();

      // now triggering second call to set link form from on changes hook
      component.ngOnChanges({
        activated: {
          firstChange: false,
          isFirstChange: jest.fn(),
          previousValue: true,
          currentValue: false,
        },
      });
      expect(fbSpy).toHaveBeenCalledTimes(2);
      expect(component.linkForm).toBeInstanceOf(FormGroup);
    });
  });

  describe('ngOnInit', () => {
    it('should set isEdit flag to false when link input is nullish', () => {
      fixture.detectChanges();
      expect(component.isEdit).toEqual(false);
    });

    it('should set isEdit flag to true when link input is set', () => {
      component.link = {
        label: 'Foo',
        index: 0,
        url: 'https://foo',
      };
      fixture.detectChanges();
      expect(component.isEdit).toEqual(true);
    });
  });

  describe('linkFormSubmit', () => {
    it('should call prevent default on event and save', () => {
      fixture.detectChanges();
      const mockEvent: any = {
        preventDefault: jest.fn(),
      };
      jest.spyOn(component, 'save');

      component.linkFormSubmit(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(component.save).toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should return early if link form can not be submitted', () => {
      fixture.detectChanges();
      jest.spyOn(component.linkUpdate, 'emit');

      component.save();
      expect(component.linkUpdate.emit).not.toHaveBeenCalled();
    });

    it('should emit internal link update if link input has no "url" prop set', () => {
      component.link = {
        label: 'Bar',
        index: 1,
        slug: 'bar',
        pageId: '12345',
      };
      fixture.detectChanges();
      jest.spyOn(component.linkUpdate, 'emit');
      component.linkForm.markAsDirty();

      component.save();
      expect(component.linkUpdate.emit).toHaveBeenLastCalledWith({
        ...component.link,
      });
    });

    it('should emit external link update if link input has "url" prop set', () => {
      component.link = {
        label: 'FooBar',
        index: 2,
        url: 'https://foobar',
      };
      fixture.detectChanges();
      jest.spyOn(component.linkUpdate, 'emit');
      component.linkForm.markAsDirty();

      component.save();
      expect(component.linkUpdate.emit).toHaveBeenLastCalledWith({
        ...component.link,
      });
    });
  });

  describe('internalLinkPageUpdate', () => {
    it('should set pageId and slug base on event', () => {
      component.link = {
        label: 'Hello',
        index: 7,
        slug: 'world',
        pageId: '67890',
      };
      fixture.detectChanges();
      const mockUpdateEvent = {
        _id: '66666',
        slug: 'test',
      };

      component.internalLinkPageUpdate(mockUpdateEvent);
      expect(component.link.slug).toEqual(mockUpdateEvent.slug);
      expect(component.link.pageId).toEqual(mockUpdateEvent._id);
    });
  });

  describe('get asPage', () => {
    it('should return null if link is external or nullish', () => {
      expect(component.asPage).toBeNull();

      component.link = {
        label: 'Google',
        index: 4,
        url: 'google',
      };
      fixture.detectChanges();

      expect(component.asPage).toBeNull();
    });

    it('should return Page like object link is internal', () => {
      expect(component.asPage).toBeNull();

      component.link = {
        label: 'About',
        index: 10,
        slug: 'about',
        pageId: '33333',
      };
      fixture.detectChanges();

      expect(component.asPage).toEqual({
        _id: component.link.pageId,
        slug: component.link.slug,
      });
    });
  });

  describe('get linkFormCtrl', () => {
    it('should return link form controls', () => {
      fixture.detectChanges();
      expect(component.linkFormCtrl).toEqual(component.linkForm.controls);
    });
  });
});
