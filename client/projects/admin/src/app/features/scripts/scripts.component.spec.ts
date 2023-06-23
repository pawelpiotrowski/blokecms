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
import { ScriptsComponent } from './scripts.component';
import { DeleteScriptGQL, GetScriptsGQL, LoggerService } from 'shared-lib';
import { appDisplaySuccessMessage } from '../../app.actions';

describe('ScriptsComponent', () => {
  let component: ScriptsComponent;
  let fixture: ComponentFixture<ScriptsComponent>;
  let router: Router;
  let logger: LoggerService;
  let deleteScript: DeleteScriptGQL;
  let actions: Actions;
  const scriptsSource$ = new Subject();
  const mockScriptsSourceRefetch = jest.fn().mockResolvedValue([]);
  const mockScriptsSource = {
    watch: jest.fn().mockReturnValue({
      valueChanges: scriptsSource$.asObservable(),
      refetch: mockScriptsSourceRefetch,
    }),
  };
  const deleteScriptSource$ = new Subject();
  const mockDeleteScriptSource = {
    mutate: jest.fn().mockReturnValue(deleteScriptSource$.asObservable()),
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
      declarations: [ScriptsComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ApolloTestingModule,
      ],
      providers: [
        { provide: GetScriptsGQL, useValue: mockScriptsSource },
        { provide: DeleteScriptGQL, useValue: mockDeleteScriptSource },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: Actions, useValue: mockActions },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScriptsComponent);
    router = TestBed.inject(Router);
    logger = TestBed.inject(LoggerService);
    actions = TestBed.inject(Actions);
    deleteScript = TestBed.inject(DeleteScriptGQL);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('columns', () => {
    it('should set columns', () => {
      expect(component.columns.length).toEqual(1);
      // name column
      expect(component.columns[0].columnDef).toEqual('name');
      expect(component.columns[0].header).toEqual('Name');
      expect(component.columns[0].cell({ name: 'Main script' })).toEqual(
        'Main script',
      );
    });
  });

  describe('data', () => {
    it('should be set to scripts source data on update', () => {
      const mockDataSourceUpdate = {
        loading: false,
        data: {
          scripts: [
            {
              _id: '1',
            },
          ],
        },
      };
      router.initialNavigation();
      scriptsSource$.next(mockDataSourceUpdate);
      expect(component.data).toEqual(mockDataSourceUpdate.data.scripts);
    });
  });

  describe('actionEventHandler', () => {
    const mockRowAsScript = { _id: '1' };

    it('should redirect to script edit view on edit action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.editActionEventHandler(mockRowAsScript);

      expect(router.navigate).toHaveBeenLastCalledWith([
        '/settings/scripts',
        mockRowAsScript._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/settings/scripts',
        mockRowAsScript._id,
      ]);
      expect(deleteScript.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsScript._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Script action foo not supported`,
        ScriptsComponent.name,
      );
    });

    it('should redirect to script view on view action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();
      await component.viewActionEventHandler(mockRowAsScript);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/settings/scripts',
        mockRowAsScript._id,
        'edit',
      ]);
      expect(router.navigate).toHaveBeenLastCalledWith([
        '/settings/scripts',
        mockRowAsScript._id,
      ]);
      expect(deleteScript.mutate).not.toHaveBeenLastCalledWith({
        id: mockRowAsScript._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Script action foo not supported`,
        ScriptsComponent.name,
      );
    });

    it('should call mutation delete script gql service on delete action', async () => {
      jest.spyOn(router, 'navigate');
      (logger.warn as jest.Mock).mockClear();

      await component.deleteActionEventHandler(mockRowAsScript);

      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/settings/scripts',
        mockRowAsScript._id,
        'edit',
      ]);
      expect(router.navigate).not.toHaveBeenLastCalledWith([
        '/settings/scripts',
        mockRowAsScript._id,
      ]);
      expect(deleteScript.mutate).toHaveBeenLastCalledWith({
        id: mockRowAsScript._id,
      });
      expect(logger.warn).not.toHaveBeenLastCalledWith(
        `Script action foo not supported`,
        ScriptsComponent.name,
      );
    });

    it('should refetch scripts after deleting on delete action and toggle loading', fakeAsync(() => {
      component.deleteActionEventHandler(mockRowAsScript);

      expect(component.loading).toEqual(true);
      deleteScriptSource$.next({ _id: '2' });
      tick();
      expect(mockScriptsSourceRefetch).toHaveBeenCalled();
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplaySuccessMessage({
          message: `${component.entityLabel} deleted`,
        }),
      );
    }));
  });
});
