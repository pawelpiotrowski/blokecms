import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { GetBlockNameGQL } from 'shared-lib';
import { ArticleFormContentNameComponent } from './article-form-content-name.component';

describe('ArticleFormContentNameComponent', () => {
  let component: ArticleFormContentNameComponent;
  let fixture: ComponentFixture<ArticleFormContentNameComponent>;
  let getBlockName: GetBlockNameGQL;

  const getBlockNameSource$ = new Subject();
  const mockGetBlockNameSource = {
    fetch: jest.fn().mockReturnValue(getBlockNameSource$.asObservable()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleFormContentNameComponent],
      providers: [
        { provide: GetBlockNameGQL, useValue: mockGetBlockNameSource },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleFormContentNameComponent);
    getBlockName = TestBed.inject(GetBlockNameGQL);
    component = fixture.componentInstance;
  });

  it('should fetch block name passing id', () => {
    component.id = '123';
    fixture.detectChanges();
    getBlockNameSource$.next({
      loading: false,
      data: { blockName: 'Block name' },
    });
    expect(getBlockName.fetch).toHaveBeenLastCalledWith(
      { id: '123' },
      { fetchPolicy: 'network-only' },
    );
    expect(component.name).toEqual('Block name');
  });

  it('should return early if id is not defined', () => {
    component.id = undefined as any;
    (getBlockName.fetch as jest.Mock).mockClear();
    fixture.detectChanges();
    getBlockNameSource$.next({
      loading: false,
      data: { blockName: 'Block name' },
    });
    expect(getBlockName.fetch).not.toHaveBeenCalled();
    expect(component.name).toBeUndefined();
  });

  it('should unsubscribe from name updates when destoyed', () => {
    component.id = '123';
    fixture.detectChanges();
    getBlockNameSource$.next({
      loading: false,
      data: { blockName: 'Block name' },
    });
    expect(getBlockName.fetch).toHaveBeenLastCalledWith(
      { id: '123' },
      { fetchPolicy: 'network-only' },
    );
    expect(component.name).toEqual('Block name');
    (getBlockName.fetch as jest.Mock).mockClear();
    component.ngOnDestroy();

    getBlockNameSource$.next({
      loading: false,
      data: { blockName: 'Other name' },
    });
    expect(getBlockName.fetch).not.toHaveBeenCalled();
    expect(component.name).toEqual('Block name');
  });
});
