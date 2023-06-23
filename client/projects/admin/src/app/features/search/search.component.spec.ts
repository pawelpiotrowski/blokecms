import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

const mockSearchDataContent = [
  { _id: '1' },
  { _id: '2' },
  { _id: '3' },
  { _id: '4' },
];
const mockSearchQuery$ = new Subject();
const mockGetSearchResults = {
  watch: jest.fn().mockReturnThis(),
  valueChanges: mockSearchQuery$.asObservable(),
  refetch: jest.fn(),
};

interface SearchContentType {
  _id: string;
}
type SearchQueryServiceType = typeof mockGetSearchResults;

describe('SearchComponent', () => {
  let component: SearchComponent<
    SearchContentType,
    SearchQueryServiceType,
    SearchContentType,
    undefined
  >;
  let fixture: ComponentFixture<
    SearchComponent<
      SearchContentType,
      SearchQueryServiceType,
      SearchContentType,
      undefined
    >
  >;
  let dialogData: typeof MAT_DIALOG_DATA;

  const mockDialogData = {
    content: mockSearchDataContent,
    service: mockGetSearchResults,
    dataQueryRef: (a: any[]) => a,
    isSelected: jest.fn(),
    removeItem: jest.fn(),
    inputPlaceholder: 'foo',
    inputLabel: 'bar',
    resultItemDisplay: jest.fn(),
    getResultAsContent: jest.fn(),
    getQueryInput: (s: string) => ({ q: s }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [MatDialogModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockDialogData }],
    });
    fixture = TestBed.createComponent(
      SearchComponent<
        SearchContentType,
        SearchQueryServiceType,
        SearchContentType,
        undefined
      >,
    );
    component = fixture.componentInstance;
    dialogData = TestBed.inject(MAT_DIALOG_DATA);
  });

  describe('ngOnInit', () => {
    it('should push null state to browser history', () => {
      jest.spyOn(history, 'pushState');
      fixture.detectChanges();
      expect(history.state).toBeNull();
      expect(history.pushState).not.toHaveBeenCalled();
      history.replaceState({}, '');
      expect(history.state).toEqual({});
      component.ngOnInit();
      expect(history.pushState).toHaveBeenLastCalledWith(null, '');
    });

    it('should set search form and value change subscription', () => {
      expect(component.searchForm).toBeUndefined();
      fixture.detectChanges();
      expect(component.searchForm).toBeInstanceOf(FormGroup);

      component.searchResult.push({ _id: '4' });
      expect(component.searchResult.length).toEqual(1);
      jest.spyOn(component.searchQuery, 'refetch');
      component.searchForm.setValue({
        query: 'Bar',
      });
      expect(component.searchResult.length).toEqual(0);
      expect(component.searchQuery.refetch).toHaveBeenLastCalledWith({
        q: 'Bar',
      });
    });
  });

  describe('select', () => {
    it('should add result item to the beginning of selection array', () => {
      fixture.detectChanges();
      expect(component.selectedResult.length).toEqual(0);
      component.select(mockSearchDataContent[0]);
      expect(component.selectedResult.length).toEqual(1);
      component.select(mockSearchDataContent[1]);
      expect(component.selectedResult.length).toEqual(2);
      expect(component.selectedResult[0]._id).toEqual(
        mockSearchDataContent[1]._id,
      );
    });
  });

  describe('selectAll', () => {
    it('should add all search result items that are not yet selected to the beginning of selection array', () => {
      fixture.detectChanges();
      component.select(mockSearchDataContent[1]);
      component.select(mockSearchDataContent[2]);
      expect(component.selectedResult.length).toEqual(2);

      mockSearchQuery$.next({
        loading: false,
        data: [mockSearchDataContent[2], mockSearchDataContent[3]],
      });

      component.selectAll();

      expect(component.selectedResult.length).toEqual(4);
      expect(component.selectedResult[0]._id).toEqual(
        mockSearchDataContent[2]._id,
      );
    });
  });

  describe('remove', () => {
    it('should call data removeItem', () => {
      fixture.detectChanges();
      component.remove(mockSearchDataContent[0]);

      expect(mockDialogData.removeItem).toHaveBeenLastCalledWith(
        mockSearchDataContent[0],
        component.searchResult,
      );
    });
  });

  describe('removeAll', () => {
    it('should empty selection array', () => {
      fixture.detectChanges();
      component.select(mockSearchDataContent[2]);
      component.select(mockSearchDataContent[3]);
      expect(component.selectedResult.length).toEqual(2);

      component.removeAll();

      expect(component.selectedResult.length).toEqual(0);
    });
  });

  describe('onSubmit', () => {
    it('should call preventDefault on event and select all if search results is not empty', () => {
      fixture.detectChanges();
      const mockEvent = { preventDefault: jest.fn() };
      jest.spyOn(component, 'selectAll');

      component.onSubmit(mockEvent as any);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(component.selectAll).not.toHaveBeenCalled();

      mockSearchQuery$.next({
        loading: false,
        data: [mockSearchDataContent[3]],
      });

      component.onSubmit(mockEvent as any);
      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(2);
      expect(component.selectAll).toHaveBeenCalled();
    });
  });

  describe('resultItem', () => {
    it('should call data resultItemDisplay', () => {
      fixture.detectChanges();
      component.resultItem(mockSearchDataContent[1]);

      expect(mockDialogData.resultItemDisplay).toHaveBeenLastCalledWith(
        mockSearchDataContent[1],
      );
    });
  });

  describe('isSelected', () => {
    it('should call data isSelected', () => {
      fixture.detectChanges();
      component.isSelected(mockSearchDataContent[2]);

      expect(mockDialogData.isSelected).toHaveBeenLastCalledWith(
        mockSearchDataContent[2],
        component.selectedResult,
        mockDialogData.content,
      );
    });
  });

  describe('selectedResultAsContent', () => {
    it('should call data getResultAsContent if defined', () => {
      fixture.detectChanges();
      component.selectedResultAsContent;

      expect(mockDialogData.getResultAsContent).toHaveBeenLastCalledWith(
        component.selectedResult,
      );
    });

    it('should call data getResult if getResultAsContent is NOT defined', () => {
      (mockDialogData as any).getResultAsContent = null;
      (mockDialogData as any).getResult = jest.fn();

      fixture.detectChanges();
      component.selectedResultAsContent;

      expect((mockDialogData as any).getResult).toHaveBeenLastCalledWith(
        component.selectedResult,
      );
    });
  });
});
