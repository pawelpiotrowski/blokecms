import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { Router } from '@angular/router';
import { Actions } from '@ngneat/effects-ng';
import { Subject } from 'rxjs';
import { StylesComponent } from './styles.component';
import { DeleteStyleGQL, GetStylesGQL, LoggerService } from 'shared-lib';
import { appDisplaySuccessMessage } from '../../app.actions';

describe('StylesComponent', () => {
  let component: StylesComponent;
  let fixture: ComponentFixture<StylesComponent>;
  let router: Router;
  let logger: LoggerService;
  let deleteStyle: DeleteStyleGQL;
  let actions: Actions;
  const stylesSource$ = new Subject();
  const mockStylesSourceRefetch = jest.fn().mockResolvedValue([]);
  const mockStylesSource = {
    watch: jest.fn().mockReturnValue({
      valueChanges: stylesSource$.asObservable(),
      refetch: mockStylesSourceRefetch,
    }),
  };
  const deleteStyleSource$ = new Subject();
  const mockDeleteStyleSource = {
    mutate: jest.fn().mockReturnValue(deleteStyleSource$.asObservable()),
  };
  const mockLoggerService = {
    error: jest.fn(),
    warn: jest.fn(),
  };
  const mockActions = {
    dispatch: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StylesComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ApolloTestingModule,
      ],
      providers: [
        { provide: GetStylesGQL, useValue: mockStylesSource },
        { provide: DeleteStyleGQL, useValue: mockDeleteStyleSource },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: Actions, useValue: mockActions },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StylesComponent);
    router = TestBed.inject(Router);
    logger = TestBed.inject(LoggerService);
    actions = TestBed.inject(Actions);
    deleteStyle = TestBed.inject(DeleteStyleGQL);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('columns', () => {
    it('should set columns', () => {
      expect(component.columns.length).toEqual(1);
      // name column
      expect(component.columns[0].columnDef).toEqual('name');
      expect(component.columns[0].header).toEqual('Name');
      expect(component.columns[0].cell({ name: 'Main style' })).toEqual(
        'Main style',
      );
    });
  });

  describe('data', () => {
    it('should be set to styles source data on update', () => {
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          styles: [
            {
              _id: '1',
            },
          ],
        },
      };
      router.initialNavigation();
      stylesSource$.next(mockDataSourceUpdate);
      expect(component.data).toEqual(mockDataSourceUpdate.data.styles);
    });
  });

  describe('actionEventHandler', () => {
    const mockRowAsStyle = { _id: '1' };

    it('should redirect to style edit view on edit action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.editActionEventHandler(mockRowAsStyle);

      expect(router.navigate).toHaveBeenLastCalledWith([
        '/settings/styles',
        mockRowAsStyle._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/settings/styles',
        mockRowAsStyle._id,
      ]);
      expect(deleteStyle.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsStyle._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Style action foo not supported`,
        StylesComponent.name,
      );
    });

    it('should redirect to style view on view action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.viewActionEventHandler(mockRowAsStyle);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/settings/styles',
        mockRowAsStyle._id,
        'edit',
      ]);
      expect(router.navigate).toHaveBeenLastCalledWith([
        '/settings/styles',
        mockRowAsStyle._id,
      ]);
      expect(deleteStyle.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsStyle._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Style action foo not supported`,
        StylesComponent.name,
      );
    });

    it('should call mutation delete style gql service on delete action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();

      await component.deleteActionEventHandler(mockRowAsStyle);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/settings/styles',
        mockRowAsStyle._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/settings/styles',
        mockRowAsStyle._id,
      ]);
      expect(deleteStyle.mutate).toHaveBeenLastCalledWith({
        id: mockRowAsStyle._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Style action foo not supported`,
        StylesComponent.name,
      );
    });

    it('should refetch styles after deleting on delete action and toggle loading', fakeAsync(() => {
      component.deleteActionEventHandler(mockRowAsStyle);

      expect(component.loading).toEqual(true);
      deleteStyleSource$.next({ _id: '2' });
      tick();
      expect(mockStylesSourceRefetch).toHaveBeenCalled();
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplaySuccessMessage({
          message: `${component.entityLabel} deleted`,
        }),
      );
    }));
  });
});
