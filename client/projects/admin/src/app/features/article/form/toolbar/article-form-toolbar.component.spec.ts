import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ArticleFormToolbarComponent } from './article-form-toolbar.component';
import { GetBlocksByNameGQL } from 'shared-lib';
import { searchDialogSize } from '../../../search/search.interface';
import { SearchComponent } from '../../../search/search.component';

describe('ArticleFormToolbarComponent', () => {
  let component: ArticleFormToolbarComponent;
  let fixture: ComponentFixture<ArticleFormToolbarComponent>;
  let dialog: MatDialog;

  const mockGetBlocksByName$ = new Subject();
  const mockGetBlocksByName = {
    watch: jest.fn().mockReturnThis(),
    valueChanges: mockGetBlocksByName$.asObservable(),
    refetch: jest.fn(),
  };

  const mockDialogAfterCloseSource$ = new Subject();
  const mockDialog = {
    open: jest.fn().mockReturnThis(),
    afterClosed: jest
      .fn()
      .mockReturnValue(mockDialogAfterCloseSource$.asObservable()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleFormToolbarComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: GetBlocksByNameGQL, useValue: mockGetBlocksByName },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleFormToolbarComponent);
    dialog = TestBed.inject(MatDialog);
    component = fixture.componentInstance;
  });

  describe('toggleExpanded', () => {
    it('should emit result of expanded flag toggle', () => {
      jest.spyOn(component.expandedChange, 'emit');
      component.expanded = false;
      fixture.detectChanges();

      component.toggleExpanded();
      expect(component.expanded).toEqual(true);
      expect(component.expandedChange.emit).toHaveBeenLastCalledWith(true);
    });
  });

  describe('getButtonLinkParams', () => {
    it('should return query params with pageId if defined', () => {
      component.articleId = '312';
      fixture.detectChanges();

      expect(component.getButtonLinkParams()).toEqual({
        parent: 'articles',
        id: '312',
      });
      component.pageId = '213';
      fixture.detectChanges();
      expect(component.getButtonLinkParams()).toEqual({
        parent: 'articles',
        id: '312',
        pageId: '213',
      });
    });
  });

  describe('getSearchResultItemDisplay', () => {
    it('should return item kind and name as string', () => {
      expect(
        component.getSearchResultItemDisplay({
          kind: 'foo',
          name: 'bar',
        } as any),
      ).toEqual('foo : bar');
    });
  });

  describe('openSearch', () => {
    it('should open mat dialog and subscribe to after closed updates', () => {
      jest.spyOn(component.searchResult, 'emit');
      component.content = [];
      fixture.detectChanges();

      component.openSearch();
      expect(dialog.open).toHaveBeenLastCalledWith(
        SearchComponent,
        expect.anything(),
      );
      const dialogData = (dialog.open as jest.Mock).mock.calls[0][1];

      expect(dialogData).toEqual(
        expect.objectContaining({
          ...searchDialogSize,
        }),
      );

      expect(dialogData.data.content).toEqual(component.content);
      expect(dialogData.data.service).toEqual(mockGetBlocksByName);
      expect(typeof dialogData.data).not.toHaveProperty('getResult');
      expect(dialogData.data.inputPlaceholder).toEqual(
        'Find block or multimedia by name',
      );
      expect(dialogData.data.inputLabel).toEqual(
        'Enter block or multimedia name',
      );

      expect(
        dialogData.data.dataQueryRef({ findBlocksByName: 'test' }),
      ).toEqual('test');

      expect(
        dialogData.data.isSelected(
          { _id: 'foo' },
          [{ _id: 'foo' }],
          [{ refId: 'foo' }],
        ),
      ).toEqual(true);

      expect(
        dialogData.data.isSelected(
          { _id: 'foo' },
          [{ _id: 'bar' }],
          [{ refId: 'foo' }],
        ),
      ).toEqual(true);

      expect(
        dialogData.data.isSelected(
          { _id: 'foo' },
          [{ _id: 'bar' }],
          [{ refId: 'bar' }],
        ),
      ).toEqual(false);

      expect(
        dialogData.data.removeItem({ _id: 'foo' }, [{ _id: 'foo' }]),
      ).toEqual([]);

      expect(
        dialogData.data.getResultAsContent([
          {
            _id: '1',
            kind: 'bar',
            __typename: 'foo',
          },
        ]),
      ).toEqual([
        {
          refId: '1',
          kind: 'bar',
          __typename: 'foo',
        },
      ]);

      expect(dialogData.data.getQueryInput('foo')).toEqual({ name: 'foo' });

      mockDialogAfterCloseSource$.next(undefined);
      expect(component.searchResult.emit).not.toHaveBeenCalled();
      mockDialogAfterCloseSource$.next(null);
      expect(component.searchResult.emit).not.toHaveBeenCalled();
      mockDialogAfterCloseSource$.next([]);
      expect(component.searchResult.emit).not.toHaveBeenCalled();

      mockDialogAfterCloseSource$.next([{ refId: '111', kind: 'text' }]);
      expect(component.searchResult.emit).toHaveBeenLastCalledWith([
        { refId: '111', kind: 'text' },
      ]);
    });
  });
});
