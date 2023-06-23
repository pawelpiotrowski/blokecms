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
import {
  DeleteBlockTextGQL,
  GetBlocksTextGQL,
  LoggerService,
} from 'shared-lib';
import { BlocksComponent } from './blocks.component';
import { appDisplaySuccessMessage } from '../../app.actions';

describe('BlocksComponent', () => {
  let component: BlocksComponent;
  let fixture: ComponentFixture<BlocksComponent>;
  let router: Router;
  let logger: LoggerService;
  let deleteTextGql: DeleteBlockTextGQL;
  let actions: Actions;
  const textsSource$ = new Subject();
  const mockTextsSourceRefetch = jest.fn().mockResolvedValue([]);
  const mockTextsSource = {
    watch: jest.fn().mockReturnValue({
      valueChanges: textsSource$.asObservable(),
      refetch: mockTextsSourceRefetch,
    }),
  };
  const deleteTextSource$ = new Subject();
  const mockDeleteTextSource = {
    mutate: jest.fn().mockReturnValue(deleteTextSource$.asObservable()),
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
      declarations: [BlocksComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ApolloTestingModule,
      ],
      providers: [
        { provide: GetBlocksTextGQL, useValue: mockTextsSource },
        { provide: DeleteBlockTextGQL, useValue: mockDeleteTextSource },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: Actions, useValue: mockActions },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlocksComponent);
    router = TestBed.inject(Router);
    logger = TestBed.inject(LoggerService);
    actions = TestBed.inject(Actions);
    deleteTextGql = TestBed.inject(DeleteBlockTextGQL);
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
    it('should be set to blocks source data on update', () => {
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          blocksText: [
            {
              _id: '1',
            },
          ],
        },
      };
      router.initialNavigation();
      textsSource$.next(mockDataSourceUpdate);
      expect(component.data).toEqual(mockDataSourceUpdate.data.blocksText);
    });
  });

  describe('actionEventHandler', () => {
    const mockRowAsText = { _id: '1' };

    it('should redirect to block edit view on edit action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.editActionEventHandler(mockRowAsText);

      expect(router.navigate).toHaveBeenLastCalledWith([
        '/blocks',
        mockRowAsText._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/blocks',
        mockRowAsText._id,
      ]);
      expect(deleteTextGql.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsText._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Block action foo not supported`,
        BlocksComponent.name,
      );
    });

    it('should redirect to block view on view action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.viewActionEventHandler(mockRowAsText);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/blocks',
        mockRowAsText._id,
        'edit',
      ]);
      expect(router.navigate).toHaveBeenLastCalledWith([
        '/blocks',
        mockRowAsText._id,
      ]);
      expect(deleteTextGql.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsText._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Block action foo not supported`,
        BlocksComponent.name,
      );
    });

    it('should call mutation delete block gql service on delete action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();

      await component.deleteActionEventHandler(mockRowAsText);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/blocks',
        mockRowAsText._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/blocks',
        mockRowAsText._id,
      ]);
      expect(deleteTextGql.mutate).toHaveBeenLastCalledWith({
        id: mockRowAsText._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Block action foo not supported`,
        BlocksComponent.name,
      );
    });

    it('should refetch blocks after deleting on delete action and toggle loading', fakeAsync(() => {
      component.deleteActionEventHandler(mockRowAsText);

      expect(component.loading).toEqual(true);
      deleteTextSource$.next({ _id: '2' });
      tick();
      expect(mockTextsSourceRefetch).toHaveBeenCalled();
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplaySuccessMessage({
          message: `${component.entityLabel} deleted`,
        }),
      );
    }));
  });
});
