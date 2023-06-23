import { Injectable } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { gql, Mutation, MutationResult, Query } from 'apollo-angular';
import { LoggerService } from 'shared-lib';
import {
  appDisplayErrorMessage,
  appDisplaySuccessMessage,
} from '../../app.actions';
import { PageContentEntityFormService } from './page-content-entity-form.service';
import {
  pageContentEntityDisableResetButton,
  pageContentEntityDisableSaveButton,
  pageContentEntityEnableResetButton,
  pageContentEntityEnableSaveButton,
} from '../page-content-entity-layout/page-entity-content.actions';
import { Subject } from 'rxjs';

export interface MockTestEntity {
  _id: string;
  name: string;
}

export interface MockTestListEntityResponse {
  tests: MockTestEntity[];
}

export interface MockTestEntityResponse {
  test: MockTestEntity;
}

export interface MockCreateEntityResponse {
  createTest: MockTestEntity;
}

export interface MockUpdateEntityResponse {
  updateTest: MockTestEntity;
}

@Injectable()
export class MockTestEntityListQueryGQL extends Query<MockTestListEntityResponse> {
  override document = gql`
    query tests {
      tests {
        _id
        name
      }
    }
  `;
}

@Injectable()
export class MockTestEntityQueryGQL extends Query<MockTestEntityResponse> {
  override document = gql`
    query test {
      test {
        _id
        name
      }
    }
  `;
}

@Injectable()
export class MockCreateTestEntityMutationGQL extends Mutation<MockCreateEntityResponse> {
  override document = gql`
    mutation createTest($input: Partial<MockTestEntity>!) {
      createTest(input: $input) {
        _id
        namen
      }
    }
  `;
}

@Injectable()
export class MockUpdateTestEntityMutationGQL extends Mutation<MockUpdateEntityResponse> {
  override document = gql`
    mutation updateTest($input: Partial<MockTestEntity>!) {
      updateTest(input: $input) {
        _id
        namen
      }
    }
  `;
}

@Injectable()
export class TestPageContentEntityFormService extends PageContentEntityFormService<
  MockCreateEntityResponse,
  MockUpdateEntityResponse,
  MockTestEntityResponse,
  MockTestEntity
> {
  constructor(
    create: MockCreateTestEntityMutationGQL,
    update: MockUpdateTestEntityMutationGQL,
    getEntities: MockTestEntityListQueryGQL,
    getEntity: MockTestEntityQueryGQL,
  ) {
    super(...PageContentEntityFormService.deps());
    this.entityListQuery = getEntities.document;
    this.entityCreateMutation = create;
    this.entityUpdateMutation = update;
    this.entityQuery = getEntity;
    this.entityLabel = 'Test';
    this.entityRedirectUrl = 'tests';
    this.entityKind = 'test';
  }

  createHandler(input: Partial<MockTestEntity>) {
    this.create<Partial<MockTestEntity>>(input, this.postCreateDataMapping);
  }

  updateHandler(input: Partial<MockTestEntity>) {
    this.update<Partial<MockTestEntity>>(input, this.postUpdateDataMapping);
  }

  postCreateDataMapping(resp: MutationResult<MockCreateEntityResponse>) {
    return resp && resp.data && resp.data.createTest
      ? resp.data.createTest
      : undefined;
  }

  postUpdateDataMapping(resp: MutationResult<MockUpdateEntityResponse>) {
    return resp && resp.data && resp.data.updateTest
      ? resp.data.updateTest
      : undefined;
  }

  get accessEntityLabel() {
    return this.entityLabel;
  }

  get accessEntityRedirectUrl() {
    return this.entityRedirectUrl;
  }
}

describe('PageContentEntityFormService', () => {
  let service: TestPageContentEntityFormService;
  let actions: Actions;
  let router: Router;
  let logger: LoggerService;
  let createTestEntity: MockCreateTestEntityMutationGQL;
  let updateTestEntity: MockUpdateTestEntityMutationGQL;
  let getTestEntity: MockTestEntityQueryGQL;

  const mockActions = {
    dispatch: jest.fn(),
  };
  const mockLoggerService = {
    error: jest.fn(),
  };
  const createTestEntitySource$ = new Subject();
  const mockCreateTestEntitySource = {
    mutate: jest.fn().mockReturnValue(createTestEntitySource$.asObservable()),
  };
  const updateTestEntitySource$ = new Subject();
  const mockUpdateTestEntitySource = {
    mutate: jest.fn().mockReturnValue(updateTestEntitySource$.asObservable()),
  };

  const getTestEntitySource$ = new Subject();
  const mockGetTestEntitySource = {
    fetch: jest.fn().mockReturnValue(getTestEntitySource$.asObservable()),
  };
  const mockGetTestEntities = { document: {} };
  const expectedMutationOptions = {
    errorPolicy: 'all',
    refetchQueries: [
      {
        query: mockGetTestEntities.document,
        variables: { repoFullName: 'apollographql/apollo-client' },
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Actions, useValue: mockActions },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: MockTestEntityListQueryGQL, useValue: mockGetTestEntities },
        { provide: MockTestEntityQueryGQL, useValue: mockGetTestEntitySource },
        {
          provide: MockCreateTestEntityMutationGQL,
          useValue: mockCreateTestEntitySource,
        },
        {
          provide: MockUpdateTestEntityMutationGQL,
          useValue: mockUpdateTestEntitySource,
        },
        TestPageContentEntityFormService,
      ],
    });
    service = TestBed.inject(TestPageContentEntityFormService);
    actions = TestBed.inject(Actions);
    router = TestBed.inject(Router);
    logger = TestBed.inject(LoggerService);
    createTestEntity = TestBed.inject(MockCreateTestEntityMutationGQL);
    updateTestEntity = TestBed.inject(MockUpdateTestEntityMutationGQL);
    getTestEntity = TestBed.inject(MockTestEntityQueryGQL);
  });

  describe('toggleSaveButton', () => {
    it('should dispatch entity enable or disable action depending on "toggleTo" flag', () => {
      service.toggleSaveButton(true);
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        pageContentEntityEnableSaveButton(),
      );
      expect(actions.dispatch).not.toHaveBeenLastCalledWith(
        pageContentEntityDisableSaveButton(),
      );

      (actions.dispatch as jest.Mock).mockClear();

      service.toggleSaveButton(false);
      expect(actions.dispatch).not.toHaveBeenLastCalledWith(
        pageContentEntityEnableSaveButton(),
      );
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        pageContentEntityDisableSaveButton(),
      );
    });
  });

  describe('toggleResetButton', () => {
    it('should dispatch entity enable or disable action depending on "toggleTo" flag', () => {
      service.toggleResetButton(true);
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        pageContentEntityEnableResetButton(),
      );
      expect(actions.dispatch).not.toHaveBeenLastCalledWith(
        pageContentEntityDisableResetButton(),
      );

      (actions.dispatch as jest.Mock).mockClear();

      service.toggleResetButton(false);
      expect(actions.dispatch).not.toHaveBeenLastCalledWith(
        pageContentEntityEnableResetButton(),
      );
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        pageContentEntityDisableResetButton(),
      );
    });
  });

  describe('getLastSave', () => {
    it('should fetch entity from db', (done) => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      service.getLastSave('987').subscribe(() => {
        expect(getTestEntity.fetch).toHaveBeenLastCalledWith(
          { input: { _id: '987' } },
          {
            fetchPolicy: 'network-only',
          },
        );
        done();
      });
      getTestEntitySource$.next({
        data: {
          test: { _id: '987', name: 'Foo' },
        },
        loading: false,
      });
    });
  });

  describe('create', () => {
    const mockEntityCreateInput = {
      name: 'Create',
    };
    const mockCreatedEntity = {
      createTest: {
        _id: '123',
        ...mockEntityCreateInput,
      },
    };

    it('should create entity and display message on success', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      (actions.dispatch as jest.Mock).mockClear();
      service.createHandler(mockEntityCreateInput);
      createTestEntitySource$.next({
        loading: false,
        data: mockCreatedEntity,
      });

      tick();

      expect(createTestEntity.mutate).toHaveBeenLastCalledWith(
        {
          input: mockEntityCreateInput,
        },
        expectedMutationOptions,
      );
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplaySuccessMessage({
          message: `${service.accessEntityLabel} created`,
        }),
      );
      expect(actions.dispatch).not.toHaveBeenCalledWith(
        appDisplayErrorMessage({
          message: expect.any(String),
        }),
      );
      expect(logger.error).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenLastCalledWith([
        `/${service.accessEntityRedirectUrl}`,
        mockCreatedEntity.createTest._id,
      ]);
    }));

    it('should display message and log error on error', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      (actions.dispatch as jest.Mock).mockClear();
      service.createHandler(mockEntityCreateInput);
      createTestEntitySource$.next({
        loading: false,
        data: null,
        errors: ['test'],
      });

      tick();

      expect(actions.dispatch).not.toHaveBeenLastCalledWith(
        appDisplaySuccessMessage({
          message: `${service.accessEntityLabel} created`,
        }),
      );
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplayErrorMessage({
          message: `Error creating ${service.accessEntityLabel.toLowerCase()}, please try again`,
        }),
      );
      expect(logger.error).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    }));
  });

  describe('update', () => {
    const mockEntityUpdateInput = {
      name: 'Update',
      _id: '123',
    };
    const mockUpdatedEntity = {
      updateTest: {
        ...mockEntityUpdateInput,
      },
    };

    it('should update entity and display message on success', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      (actions.dispatch as jest.Mock).mockClear();
      (logger.error as jest.Mock).mockClear();
      service.updateHandler(mockEntityUpdateInput);
      updateTestEntitySource$.next({
        loading: false,
        data: mockUpdatedEntity,
      });

      tick();

      expect(updateTestEntity.mutate).toHaveBeenLastCalledWith(
        {
          input: {
            ...mockEntityUpdateInput,
          },
        },
        expectedMutationOptions,
      );
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplaySuccessMessage({
          message: `${service.accessEntityLabel} updated`,
        }),
      );
      expect(actions.dispatch).not.toHaveBeenCalledWith(
        appDisplayErrorMessage({
          message: expect.any(String),
        }),
      );
      expect(logger.error).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenLastCalledWith([
        `/${service.accessEntityRedirectUrl}`,
        mockEntityUpdateInput._id,
      ]);
    }));

    it('should display message and log error on error', fakeAsync(() => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      (actions.dispatch as jest.Mock).mockClear();
      service.updateHandler(mockEntityUpdateInput);
      updateTestEntitySource$.next({
        loading: false,
        data: null,
        errors: ['test'],
      });

      tick();

      expect(actions.dispatch).not.toHaveBeenLastCalledWith(
        appDisplaySuccessMessage({
          message: `${service.accessEntityLabel} updated`,
        }),
      );
      expect(actions.dispatch).toHaveBeenLastCalledWith(
        appDisplayErrorMessage({
          message: `Error updating ${service.accessEntityLabel.toLowerCase()}, please try again`,
        }),
      );
      expect(logger.error).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    }));
  });

  describe('cleanQueryParams', () => {
    it('should refresh current url to remove query params', async () => {
      jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
      await service.cleanQueryParams('456');

      expect(router.navigate).toHaveBeenLastCalledWith(
        [`/${service.accessEntityRedirectUrl}`, '456', 'edit'],
        { replaceUrl: true },
      );
    });
  });

  describe('postResponseHandler', () => {
    const mockRequestData = {
      responseData: undefined,
      responseErrors: [],
      successMessage: 'Ok',
      errorMessage: 'Oh no',
      meta: {
        isNew: true,
        entityId: '321',
        entityRedirectUrl: 'test',
        entityKind: 'foo',
      },
    };

    describe('error handler', () => {
      it('should dispatch error message and log error', async () => {
        await (service as any).postResponseHandler(mockRequestData);

        expect(actions.dispatch).toHaveBeenLastCalledWith(
          appDisplayErrorMessage({
            message: `${mockRequestData.errorMessage}, please try again`,
          }),
        );

        expect(logger.error).toHaveBeenLastCalledWith(
          mockRequestData.errorMessage,
          PageContentEntityFormService.name,
          mockRequestData.responseErrors,
        );
      });
    });

    describe('success handler', () => {
      describe('with no "parent" property in query params', () => {
        it('should dispatch success and set redirect based on meta data', async () => {
          jest.spyOn(router, 'parseUrl').mockReturnValueOnce({
            queryParams: {},
          } as any);
          jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
          await (service as any).postResponseHandler({
            ...mockRequestData,
            responseData: {
              _id: '456',
            },
          });

          expect(actions.dispatch).toHaveBeenLastCalledWith(
            appDisplaySuccessMessage({
              message: mockRequestData.successMessage,
            }),
          );

          expect(router.navigate).toHaveBeenLastCalledWith([
            `/${mockRequestData.meta.entityRedirectUrl}`,
            mockRequestData.meta.entityId,
          ]);
        });
      });

      describe('with "parent" property in query params', () => {
        it('should dispatch success and set redirect based on query params', async () => {
          const mockQueryParams = {
            parent: 'test',
            id: '432',
          };

          jest.spyOn(router, 'parseUrl').mockReturnValueOnce({
            queryParams: mockQueryParams,
          } as any);
          jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
          await (service as any).postResponseHandler({
            ...mockRequestData,
            responseData: {
              _id: '987',
            },
          });

          expect(actions.dispatch).toHaveBeenLastCalledWith(
            appDisplaySuccessMessage({
              message: mockRequestData.successMessage,
            }),
          );

          expect(router.navigate).toHaveBeenLastCalledWith(
            [`/${mockQueryParams.parent}`, mockQueryParams.id, 'edit'],
            {
              queryParams: {
                id: mockRequestData.meta.entityId,
                kind: mockRequestData.meta.entityKind,
                new: true,
              },
            },
          );
        });
      });

      describe('with "parent" and "pageId" properties in query params', () => {
        it('should dispatch success and set redirect based on query params', async () => {
          const mockQueryParams = {
            parent: 'test',
            id: '432',
            pageId: '999',
          };

          jest.spyOn(router, 'parseUrl').mockReturnValueOnce({
            queryParams: mockQueryParams,
          } as any);
          jest.spyOn(router, 'navigate').mockResolvedValueOnce(true);
          await (service as any).postResponseHandler({
            ...mockRequestData,
            responseData: {
              _id: '987',
            },
          });

          expect(actions.dispatch).toHaveBeenLastCalledWith(
            appDisplaySuccessMessage({
              message: mockRequestData.successMessage,
            }),
          );

          expect(router.navigate).toHaveBeenLastCalledWith(
            [`/${mockQueryParams.parent}`, mockQueryParams.id, 'edit'],
            {
              queryParams: {
                id: mockRequestData.meta.entityId,
                kind: mockRequestData.meta.entityKind,
                new: true,
                pageId: mockQueryParams.pageId,
              },
            },
          );
        });
      });
    });
  });
});
