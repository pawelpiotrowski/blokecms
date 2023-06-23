import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, throwError } from 'rxjs';
import {
  GetBlockCodeGQL,
  GetBlockMediaGQL,
  GetBlockTextGQL,
  LoggerService,
} from 'shared-lib';
import { ArticleContentComponent } from './article-content.component';

describe('ArticleContentComponent', () => {
  let component: ArticleContentComponent;
  let fixture: ComponentFixture<ArticleContentComponent>;
  let getTextGql: GetBlockTextGQL;
  let getMediaGql: GetBlockMediaGQL;
  let getCodeGql: GetBlockCodeGQL;
  let logger: LoggerService;

  const getBlockTextSource$ = new Subject();
  const mockGetBlockTextSource = {
    fetch: jest.fn().mockReturnValue(getBlockTextSource$.asObservable()),
  };
  const getBlockMediaSource$ = new Subject();
  const mockGetBlockMediaSource = {
    fetch: jest.fn().mockReturnValue(getBlockMediaSource$.asObservable()),
  };
  const getBlockCodeSource$ = new Subject();
  const mockGetBlockCodeSource = {
    fetch: jest.fn().mockReturnValue(getBlockCodeSource$.asObservable()),
  };
  const mockLoggerService = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleContentComponent],
      providers: [
        { provide: GetBlockTextGQL, useValue: mockGetBlockTextSource },
        { provide: GetBlockMediaGQL, useValue: mockGetBlockMediaSource },
        { provide: GetBlockCodeGQL, useValue: mockGetBlockCodeSource },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleContentComponent);
    getTextGql = TestBed.inject(GetBlockTextGQL);
    getMediaGql = TestBed.inject(GetBlockMediaGQL);
    getCodeGql = TestBed.inject(GetBlockCodeGQL);
    logger = TestBed.inject(LoggerService);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should set error when unsupported kind is provided', () => {
      component.content = {
        kind: 'foo' as any,
        refId: '1234567',
      };
      fixture.detectChanges();
      expect(component.error).toEqual('Error - unsupported content kind "foo"');
    });

    it('should fetch text block if kind is "text"', () => {
      jest.spyOn(getTextGql, 'fetch');
      component.content = {
        kind: 'text',
        refId: '1234567',
      };
      fixture.detectChanges();

      expect(getTextGql.fetch).toHaveBeenCalledTimes(1);
      expect(getTextGql.fetch).toHaveBeenCalledWith(
        { input: { _id: component.content.refId } },
        { fetchPolicy: 'network-only' },
      );
    });

    it('should fetch media block if kind is "media"', () => {
      jest.spyOn(getMediaGql, 'fetch');
      component.content = {
        kind: 'media',
        refId: '1234567',
      };
      fixture.detectChanges();

      expect(getMediaGql.fetch).toHaveBeenCalledTimes(1);
      expect(getMediaGql.fetch).toHaveBeenCalledWith(
        { input: { _id: component.content.refId } },
        { fetchPolicy: 'network-only' },
      );
    });

    it('should fetch code block if kind is "code"', () => {
      jest.spyOn(getCodeGql, 'fetch');
      component.content = {
        kind: 'code',
        refId: '1234567',
      };
      fixture.detectChanges();

      expect(getCodeGql.fetch).toHaveBeenCalledTimes(1);
      expect(getCodeGql.fetch).toHaveBeenCalledWith(
        { input: { _id: component.content.refId } },
        { fetchPolicy: 'network-only' },
      );
    });
  });

  describe('setData', () => {
    describe('on error', () => {
      it('should set error', () => {
        component.content = {
          kind: 'text',
          refId: '321',
        };
        fixture.detectChanges();

        const mockGetBlockResp = {
          errors: 'Errors',
        };

        getBlockTextSource$.next(mockGetBlockResp);

        expect(component.error).toEqual('Error fetching block data');
      });
    });

    describe('when loading', () => {
      it('should not set data', () => {
        component.content = {
          kind: 'media',
          refId: '123',
        };
        fixture.detectChanges();

        const mockGetBlockResp = {
          data: {
            blockMedia: {
              _id: '123',
            },
          },
          loading: true,
        };

        getBlockMediaSource$.next(mockGetBlockResp);

        expect(component.data).toEqual(undefined);
      });
    });

    describe('once loaded for "text" kind', () => {
      it('should set text data', () => {
        component.content = {
          kind: 'text',
          refId: '321',
        };
        fixture.detectChanges();

        const mockGetBlockResp = {
          data: {
            blockText: {
              _id: '321',
              name: 'Bar',
            },
          },
          loading: false,
        };

        getBlockTextSource$.next(mockGetBlockResp);

        expect(component.data).toEqual(mockGetBlockResp.data);
        expect(component.dataText).toEqual(mockGetBlockResp.data.blockText);
      });
    });

    describe('once loaded for "media" kind', () => {
      it('should set media data', () => {
        component.content = {
          kind: 'media',
          refId: '123',
        };
        fixture.detectChanges();

        const mockGetBlockResp = {
          data: {
            blockMedia: {
              _id: '123',
              name: 'Foo',
            },
          },
          loading: false,
        };

        getBlockMediaSource$.next(mockGetBlockResp);

        expect(component.data).toEqual(mockGetBlockResp.data);
        expect(component.dataMedia).toEqual(mockGetBlockResp.data.blockMedia);
      });
    });

    describe('once loaded for "code" kind', () => {
      it('should set code data', () => {
        component.content = {
          kind: 'code',
          refId: '123',
        };
        fixture.detectChanges();

        const mockGetBlockResp = {
          data: {
            blockCode: {
              _id: '123',
              name: 'Foo',
            },
          },
          loading: false,
        };

        getBlockCodeSource$.next(mockGetBlockResp);

        expect(component.data).toEqual(mockGetBlockResp.data);
        expect(component.dataCode).toEqual(mockGetBlockResp.data.blockCode);
      });
    });
  });

  describe('fetchContentError', () => {
    it('should set error message and log', () => {
      jest
        .spyOn(getMediaGql, 'fetch')
        .mockReturnValueOnce(throwError(() => new Error('Not found')));
      component.content = {
        kind: 'media',
        refId: '1234567',
      };
      fixture.detectChanges();
      expect(component.error).toEqual('Error fetching block data');
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
