import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { PageContentEntityToolbarButtonAction } from '../../../layout/page-content-entity-layout/page-content-entity-layout.interface';
import { PageEntityContentRepository } from '../../../layout/page-content-entity-layout/page-entity-content.repository';
import { NavigationFormService } from './navigation-form.service';
import { NavigationFormComponent } from './navigation-form.component';
import { GetNavigationResponse } from 'shared-lib';

describe('NavigationFormComponent', () => {
  let component: NavigationFormComponent;
  let fixture: ComponentFixture<NavigationFormComponent>;
  let navigationFormService: NavigationFormService;

  const mockNavigationFormService = {
    toggleSaveButton: jest.fn(),
    toggleResetButton: jest.fn(),
    createHandler: jest.fn(),
    updateHandler: jest.fn(),
    getUpdateHandler: jest.fn(),
    getLastSave: jest.fn().mockReturnValue(of(null)),
  };

  const buttonsAction$ =
    new BehaviorSubject<PageContentEntityToolbarButtonAction>(null);
  const mockEntityRepository = {
    buttonsAction$,
  };
  const mockNavigationNew = {
    _id: '',
    name: '',
    links: [],
  };
  const mockNavigationEdit = {
    _id: '123',
    name: 'Foo',
    links: [{ pageId: '456', label: 'link' }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      declarations: [NavigationFormComponent],
      providers: [
        { provide: NavigationFormService, useValue: mockNavigationFormService },
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
      ],
    })
      .overrideComponent(NavigationFormComponent, {
        set: {
          providers: [
            {
              provide: NavigationFormService,
              useValue: mockNavigationFormService,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NavigationFormComponent);
    navigationFormService = TestBed.inject(NavigationFormService);
    component = fixture.componentInstance;
  });

  it.todo('Refactor tests to call public methods instead of private');

  describe('linksUpdateHandler', () => {
    it('should set entity items to event, mark form as dirty and enable save and reset buttons', () => {
      component.entity = mockNavigationEdit;
      fixture.detectChanges();
      jest.spyOn(component.entityForm, 'markAsDirty');

      component.linksUpdateHandler([]);
      expect(navigationFormService.toggleResetButton).toHaveBeenLastCalledWith(
        true,
      );
      expect(navigationFormService.toggleSaveButton).toHaveBeenLastCalledWith(
        true,
      );
      expect(component.entityForm.markAsDirty).toHaveBeenCalled();
      expect(component.entity.items).toEqual([]);
    });
  });

  describe('navigationLinks', () => {
    it('should return entity links or empty array', () => {
      expect(component.navigationLinks).toEqual([]);
      component.entity = mockNavigationEdit;
      fixture.detectChanges();

      expect(component.navigationLinks).toEqual(mockNavigationEdit.links);
    });
  });

  describe('resetNavigation', () => {
    it('should set navigation to query response and reset entity form', () => {
      component.entity = mockNavigationEdit;
      fixture.detectChanges();
      jest.spyOn(component.entityForm, 'setValue');

      const mockQueryRespData: GetNavigationResponse = {
        navigation: {
          _id: '313',
          name: 'FooBar',
          links: [],
        },
      };
      (component as any).resetNavigation(mockQueryRespData);

      expect(component.entity).toEqual(mockQueryRespData.navigation);
      expect(component.entityForm.setValue).toHaveBeenLastCalledWith({
        name: component.entity.name,
      });
    });
  });

  describe('create', () => {
    it('should call navigation form service create method passing form name', () => {
      component.entity = mockNavigationNew;
      fixture.detectChanges();

      component.entityForm.setValue({
        name: 'Test',
      });
      (component as any).create();

      expect(navigationFormService.createHandler).toHaveBeenLastCalledWith({
        name: component.entityForm.value.name,
        items: [],
      });
    });
  });

  describe('update', () => {
    it('should call navigation form service update method passing form name and entity id', () => {
      component.entity = mockNavigationEdit;
      fixture.detectChanges();

      component.entityForm.setValue({
        name: 'Test',
      });
      (component as any).update();

      expect(navigationFormService.updateHandler).toHaveBeenLastCalledWith({
        name: component.entityForm.value.name,
        _id: component.entity._id,
      });
    });
  });
});
