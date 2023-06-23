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
  DeleteBlockMediaGQL,
  GetBlocksMediaGQL,
  LoggerService,
} from 'shared-lib';
import { MediasComponent } from './medias.component';
import { appDisplaySuccessMessage } from '../../app.actions';

describe('MediasComponent', () => {
  let component: MediasComponent;
  let fixture: ComponentFixture<MediasComponent>;
  let router: Router;
  let logger: LoggerService;
  let deleteMediaGql: DeleteBlockMediaGQL;
  let actions: Actions;
  const mediasSource$ = new Subject();
  const mockMediasSourceRefetch = jest.fn().mockResolvedValue([]);
  const mockMediasSource = {
    watch: jest.fn().mockReturnValue({
      valueChanges: mediasSource$.asObservable(),
      refetch: mockMediasSourceRefetch,
    }),
  };
  const deleteMediaSource$ = new Subject();
  const mockDeleteMediaSource = {
    mutate: jest.fn().mockReturnValue(deleteMediaSource$.asObservable()),
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
      declarations: [MediasComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ApolloTestingModule,
      ],
      providers: [
        { provide: GetBlocksMediaGQL, useValue: mockMediasSource },
        { provide: DeleteBlockMediaGQL, useValue: mockDeleteMediaSource },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: Actions, useValue: mockActions },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MediasComponent);
    router = TestBed.inject(Router);
    logger = TestBed.inject(LoggerService);
    actions = TestBed.inject(Actions);
    deleteMediaGql = TestBed.inject(DeleteBlockMediaGQL);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('columns', () => {
    it('should set columns', () => {
      expect(component.columns.length).toEqual(1);
      // name column
      expect(component.columns[0].columnDef).toEqual('name');
      expect(component.columns[0].header).toEqual('Name');
      expect(component.columns[0].cell({ name: 'name' })).toEqual('name');
    });
  });

  describe('data', () => {
    it('should be set to medias source data on update', () => {
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          blocksMedia: [
            {
              _id: '1',
            },
          ],
        },
      };
      router.initialNavigation();
      mediasSource$.next(mockDataSourceUpdate);
      expect(component.data).toEqual(mockDataSourceUpdate.data.blocksMedia);
    });
  });

  describe('actionEventHandler', () => {
    const mockRowAsMedia = { _id: '1' };

    it('should redirect to multimedia edit view on edit action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.editActionEventHandler(mockRowAsMedia);

      expect(router.navigate).toHaveBeenLastCalledWith([
        '/multimedia',
        mockRowAsMedia._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/multimedia',
        mockRowAsMedia._id,
      ]);
      expect(deleteMediaGql.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsMedia._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Multimedia action foo not supported`,
        MediasComponent.name,
      );
    });

    it('should redirect to multimedia view on view action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.viewActionEventHandler(mockRowAsMedia);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/multimedia',
        mockRowAsMedia._id,
        'edit',
      ]);
      expect(router.navigate).toHaveBeenLastCalledWith([
        '/multimedia',
        mockRowAsMedia._id,
      ]);
      expect(deleteMediaGql.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsMedia._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Multimedia action foo not supported`,
        MediasComponent.name,
      );
    });

    it('should call mutation delete media gql service on delete action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();

      await component.deleteActionEventHandler(mockRowAsMedia);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/multimedia',
        mockRowAsMedia._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/multimedia',
        mockRowAsMedia._id,
      ]);
      expect(deleteMediaGql.mutate).toHaveBeenLastCalledWith({
        id: mockRowAsMedia._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Multimedia action foo not supported`,
        MediasComponent.name,
      );
    });

    it('should refetch medias after deleting on delete action and toggle loading', fakeAsync(() => {
      component.deleteActionEventHandler(mockRowAsMedia);

      expect(component.loading).toEqual(true);
      deleteMediaSource$.next({ _id: '2' });
      tick();
      expect(mockMediasSourceRefetch).toHaveBeenCalled();
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplaySuccessMessage({
          message: `${component.entityLabel} deleted`,
        }),
      );
    }));
  });
});
