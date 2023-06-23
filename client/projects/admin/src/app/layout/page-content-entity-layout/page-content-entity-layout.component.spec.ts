import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PageContentEntityLayoutComponent } from './page-content-entity-layout.component';
import {
  PageContentEntityToolbarButtons,
  PageContentEntityToolbarButtonsAvailability,
  pageContentEntityToolbarButtonsAvailabilityDefault,
} from './page-content-entity-layout.interface';
import { PageEntityContentRepository } from './page-entity-content.repository';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('PageContentEntityLayoutComponent', () => {
  let component: PageContentEntityLayoutComponent;
  let fixture: ComponentFixture<PageContentEntityLayoutComponent>;
  let entityRepo: PageEntityContentRepository;
  let loader: HarnessLoader;
  let matDialog: MatDialog;
  const buttonsAvailability$ =
    new BehaviorSubject<PageContentEntityToolbarButtonsAvailability>(
      pageContentEntityToolbarButtonsAvailabilityDefault,
    );
  const mockEntityRepository = {
    buttonsAvailability$,
    reset: jest.fn(),
    updateButtonsAction: jest.fn(),
  };
  const mockActivatedRouteQueryParams$ = new Subject();
  const mockActivatedRoute = {
    queryParams: mockActivatedRouteQueryParams$.asObservable(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageContentEntityLayoutComponent],
      imports: [
        MatDialogModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: PageContentEntityLayoutComponent,
          },
        ]),
      ],
      providers: [
        {
          provide: PageEntityContentRepository,
          useValue: mockEntityRepository,
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
    matDialog = TestBed.inject(MatDialog);
    entityRepo = TestBed.inject(PageEntityContentRepository);
    fixture = TestBed.createComponent(PageContentEntityLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should subscribe to entity repo buttons availability', () => {
    jest.spyOn(entityRepo.buttonsAvailability$, 'subscribe');
    fixture.detectChanges();

    expect(entityRepo.buttonsAvailability$.subscribe).toHaveBeenCalled();
  });

  it('should set buttonsAvailability to entity repo buttons availability', () => {
    fixture.detectChanges();
    const mockButtonsAvailabilityUpdate = {
      ...pageContentEntityToolbarButtonsAvailabilityDefault,
      Save: true,
    };

    buttonsAvailability$.next(mockButtonsAvailabilityUpdate);
    expect(component.buttonsAvailability).toEqual(
      mockButtonsAvailabilityUpdate,
    );
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should unsubscribe from entity repo updates and reset repo', () => {
      component.ngOnDestroy();
      expect(entityRepo.reset).toHaveBeenCalled();

      const mockButtonsAvailabilityUpdate = {
        ...pageContentEntityToolbarButtonsAvailabilityDefault,
        Back: false,
        Edit: false,
      };

      buttonsAvailability$.next(mockButtonsAvailabilityUpdate);
      expect(component.buttonsAvailability).not.toEqual(
        mockButtonsAvailabilityUpdate,
      );
    });
  });

  describe('saveButtonHandler', () => {
    it('should update repo buttons action to "save"', () => {
      fixture.detectChanges();
      component.saveButtonHandler();
      expect(entityRepo.updateButtonsAction).toHaveBeenLastCalledWith(
        PageContentEntityToolbarButtons.Save,
      );
    });
  });

  describe('resetButtonHandler', () => {
    it('should update repo buttons action to "reset"', () => {
      fixture.detectChanges();
      component.resetButtonHandler();
      expect(entityRepo.updateButtonsAction).toHaveBeenLastCalledWith(
        PageContentEntityToolbarButtons.Reset,
      );
    });
  });

  describe('deleteButtonHandler', () => {
    beforeEach(() => {
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    });

    it('should open confirm delete dialog and NOT update repo buttons action when resolved with nullish', async () => {
      (entityRepo.updateButtonsAction as jest.Mock).mockClear();
      component.deleteButtonHandler();
      let dialogs = await loader.getAllHarnesses(MatDialogHarness);

      expect(dialogs.length).toBe(1);
      await dialogs[0].close();

      dialogs = await loader.getAllHarnesses(MatDialogHarness);
      expect(dialogs.length).toBe(0);
      expect(entityRepo.updateButtonsAction).not.toHaveBeenCalled();
    });

    it('should open confirm delete dialog and update repo buttons action to "delete"', () => {
      jest.spyOn(matDialog, 'open').mockReturnValueOnce({
        afterClosed: jest.fn().mockReturnValue(of(true)),
      } as any);
      component.deleteButtonHandler();
      expect(entityRepo.updateButtonsAction).toHaveBeenLastCalledWith(
        PageContentEntityToolbarButtons.Delete,
      );
    });
  });

  describe('queryParamsHandler', () => {
    beforeEach(() => {
      component.parentRoute = 'test';
      component.parentRouteLabel = 'testLabel';
      fixture.detectChanges();
    });

    it('should set default back button route prefix based on parentRouteRelative input', (done) => {
      const mockQueryParams = {};
      const expectedPrefix = './';
      component.parentRouteRelative = true;

      component.getBackButtonRoute.subscribe((backButtonPayload) => {
        expect(backButtonPayload).toEqual({
          label: component.parentRouteLabel,
          query: null,
          route: [`${expectedPrefix}${component.parentRoute}`],
        });
        done();
      });

      mockActivatedRouteQueryParams$.next(mockQueryParams);
    });

    it('should set default back button when query params are empty', (done) => {
      const mockQueryParams = {};

      component.getBackButtonRoute.subscribe((backButtonPayload) => {
        expect(backButtonPayload).toEqual({
          label: component.parentRouteLabel,
          query: null,
          route: [`/${component.parentRoute}`],
        });
        done();
      });

      mockActivatedRouteQueryParams$.next(mockQueryParams);
    });

    it('should set default back button when query params have no parent property', (done) => {
      const mockQueryParams = {
        test: 'test',
      };

      component.getBackButtonRoute.subscribe((backButtonPayload) => {
        expect(backButtonPayload).toEqual({
          label: component.parentRouteLabel,
          query: null,
          route: [`/${component.parentRoute}`],
        });
        done();
      });

      mockActivatedRouteQueryParams$.next(mockQueryParams);
    });

    it('should set back button payload based on query params', (done) => {
      const mockQueryParams = {
        parent: 'foo',
        id: 'bar',
      };

      component.getBackButtonRoute.subscribe((backButtonPayload) => {
        expect(backButtonPayload).toEqual({
          label: 'Back',
          query: null,
          route: [`/${mockQueryParams.parent}`, mockQueryParams.id, 'edit'],
        });
        done();
      });

      mockActivatedRouteQueryParams$.next(mockQueryParams);
    });

    it('should include query in back button payload if "pageId" is present', (done) => {
      const mockQueryParams = {
        parent: 'foo',
        id: 'bar',
        pageId: '888',
      };

      component.getBackButtonRoute.subscribe((backButtonPayload) => {
        expect(backButtonPayload).toEqual({
          label: 'Back',
          query: { pageId: '888' },
          route: [`/${mockQueryParams.parent}`, mockQueryParams.id, 'edit'],
        });
        done();
      });

      mockActivatedRouteQueryParams$.next(mockQueryParams);
    });
  });
});
