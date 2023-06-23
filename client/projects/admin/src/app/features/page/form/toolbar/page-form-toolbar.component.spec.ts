import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { PageFormToolbarComponent } from './page-form-toolbar.component';
import { SearchModule } from '../../../search/search.module';
import { GetArticlesByTitleGQL } from 'shared-lib';
import { SearchComponent } from '../../../search/search.component';
import { searchDialogSize } from '../../../search/search.interface';

describe('PageFormToolbarComponent', () => {
  let component: PageFormToolbarComponent;
  let fixture: ComponentFixture<PageFormToolbarComponent>;
  let dialog: MatDialog;

  const mockArticlesByTitle$ = new Subject();
  const mockArticlesByTitle = {
    watch: jest.fn().mockReturnThis(),
    valueChanges: mockArticlesByTitle$.asObservable(),
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
      declarations: [PageFormToolbarComponent],
      imports: [MatDialogModule, SearchModule],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: GetArticlesByTitleGQL, useValue: mockArticlesByTitle },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageFormToolbarComponent);
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

  describe('getSearchResultItemDisplay', () => {
    it('should return item kind and name as string', () => {
      expect(
        component.getSearchResultItemDisplay({
          title: 'Bar',
        } as any),
      ).toEqual('Bar');
    });
  });

  describe('openSearch', () => {
    it('should open mat dialog and subscribe to after closed updates', () => {
      jest.spyOn(component.searchResult, 'emit');
      component.articles = [];
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

      expect(dialogData.data.content).toEqual(component.articles);
      expect(dialogData.data.service).toEqual(mockArticlesByTitle);
      expect(typeof dialogData.data).not.toHaveProperty('getResultAsContent');
      expect(dialogData.data.inputPlaceholder).toEqual('Find article by title');
      expect(dialogData.data.inputLabel).toEqual('Enter article title');

      expect(
        dialogData.data.dataQueryRef({ findArticlesByTitle: 'test' }),
      ).toEqual('test');

      expect(
        dialogData.data.isSelected(
          { _id: 'foo' },
          [{ _id: 'foo' }],
          [{ _id: 'foo' }],
        ),
      ).toEqual(true);

      expect(
        dialogData.data.isSelected(
          { _id: 'foo' },
          [{ _id: 'bar' }],
          [{ _id: 'foo' }],
        ),
      ).toEqual(true);

      expect(
        dialogData.data.isSelected(
          { _id: 'foo' },
          [{ _id: 'bar' }],
          [{ _id: 'bar' }],
        ),
      ).toEqual(false);

      expect(
        dialogData.data.removeItem({ _id: 'foo' }, [{ _id: 'foo' }]),
      ).toEqual([]);

      const mockResult = [
        {
          _id: '1',
        },
      ];
      expect(dialogData.data.getResult(mockResult)).toEqual(mockResult);
      expect(dialogData.data.getQueryInput('foo')).toEqual({ title: 'foo' });

      mockDialogAfterCloseSource$.next(undefined);
      expect(component.searchResult.emit).not.toHaveBeenCalled();
      mockDialogAfterCloseSource$.next(null);
      expect(component.searchResult.emit).not.toHaveBeenCalled();
      mockDialogAfterCloseSource$.next([]);
      expect(component.searchResult.emit).not.toHaveBeenCalled();

      mockDialogAfterCloseSource$.next([{ _id: '111', title: 'Hello' }]);
      expect(component.searchResult.emit).toHaveBeenLastCalledWith([
        { _id: '111', title: 'Hello' },
      ]);
    });
  });
});
