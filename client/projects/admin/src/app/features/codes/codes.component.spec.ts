import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { Subject } from 'rxjs';
import {
  DeleteBlockCodeGQL,
  GetBlocksCodeGQL,
  LoggerService,
} from 'shared-lib';
import { appDisplaySuccessMessage } from '../../app.actions';
import { CodesComponent } from './codes.component';

describe('CodesComponent', () => {
  let component: CodesComponent;
  let fixture: ComponentFixture<CodesComponent>;
  let router: Router;
  let logger: LoggerService;
  let deleteCodeGql: DeleteBlockCodeGQL;
  let actions: Actions;
  const codesSource$ = new Subject();
  const mockCodesSourceRefetch = jest.fn().mockResolvedValue([]);
  const mockCodesSource = {
    watch: jest.fn().mockReturnValue({
      valueChanges: codesSource$.asObservable(),
      refetch: mockCodesSourceRefetch,
    }),
  };
  const deleteCodeSource$ = new Subject();
  const mockDeleteCodeSource = {
    mutate: jest.fn().mockReturnValue(deleteCodeSource$.asObservable()),
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
      declarations: [CodesComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ApolloTestingModule,
      ],
      providers: [
        { provide: GetBlocksCodeGQL, useValue: mockCodesSource },
        { provide: DeleteBlockCodeGQL, useValue: mockDeleteCodeSource },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: Actions, useValue: mockActions },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CodesComponent);
    router = TestBed.inject(Router);
    logger = TestBed.inject(LoggerService);
    actions = TestBed.inject(Actions);
    deleteCodeGql = TestBed.inject(DeleteBlockCodeGQL);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('columns', () => {
    it('should set columns', () => {
      expect(component.columns.length).toEqual(1);
      expect(component.columns[0].columnDef).toEqual('name');
      expect(component.columns[0].header).toEqual('Name');
      expect(component.columns[0].cell({ name: 'name' })).toEqual('name');
    });
  });

  describe('data', () => {
    it('should be set to code blocks source data on update', () => {
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          blocksCode: [
            {
              _id: '1',
            },
          ],
        },
      };
      router.initialNavigation();
      codesSource$.next(mockDataSourceUpdate);
      expect(component.data).toEqual(mockDataSourceUpdate.data.blocksCode);
    });
  });

  describe('actionEventHandler', () => {
    const mockRowAsCode = { _id: '1' };

    it('should redirect to code edit view on edit action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.editActionEventHandler(mockRowAsCode);

      expect(router.navigate).toHaveBeenLastCalledWith([
        '/code-blocks',
        mockRowAsCode._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/code-blocks',
        mockRowAsCode._id,
      ]);
      expect(deleteCodeGql.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsCode._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Code Block action foo not supported`,
        CodesComponent.name,
      );
    });

    it('should redirect to code view on view action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.viewActionEventHandler(mockRowAsCode);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/code-blocks',
        mockRowAsCode._id,
        'edit',
      ]);
      expect(router.navigate).toHaveBeenLastCalledWith([
        '/code-blocks',
        mockRowAsCode._id,
      ]);
      expect(deleteCodeGql.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsCode._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Code Block action foo not supported`,
        CodesComponent.name,
      );
    });

    it('should call mutation delete code gql service on delete action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();

      await component.deleteActionEventHandler(mockRowAsCode);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/code-blocks',
        mockRowAsCode._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/code-blocks',
        mockRowAsCode._id,
      ]);
      expect(deleteCodeGql.mutate).toHaveBeenLastCalledWith({
        id: mockRowAsCode._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Code Block action foo not supported`,
        CodesComponent.name,
      );
    });

    it('should refetch code blocks after deleting on delete action and toggle loading', fakeAsync(() => {
      component.deleteActionEventHandler(mockRowAsCode);

      expect(component.loading).toEqual(true);
      deleteCodeSource$.next({ _id: '2' });
      tick();
      expect(mockCodesSourceRefetch).toHaveBeenCalled();
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplaySuccessMessage({
          message: `${component.entityLabel} deleted`,
        }),
      );
    }));
  });
});
