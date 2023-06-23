import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { GetPagesByTitleOrSlugGQL } from 'shared-lib';
import { PageFormAutocompleteComponent } from './page-form-autocomplete.component';

describe('PageFormAutocompleteComponent', () => {
  let component: PageFormAutocompleteComponent;
  let fixture: ComponentFixture<PageFormAutocompleteComponent>;
  let loader: HarnessLoader;
  let queryPage: GetPagesByTitleOrSlugGQL;

  const mockPageBySlugOrTitle$ = new Subject();
  const mockPageBySlugOrTitle = {
    fetch: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatAutocompleteModule, NoopAnimationsModule],
      declarations: [PageFormAutocompleteComponent],
      providers: [
        { provide: GetPagesByTitleOrSlugGQL, useValue: mockPageBySlugOrTitle },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageFormAutocompleteComponent);
    queryPage = TestBed.inject(GetPagesByTitleOrSlugGQL);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should load all autocomplete harnesses', async () => {
      const autocompletes = await loader.getAllHarnesses(
        MatAutocompleteHarness,
      );
      expect(autocompletes.length).toBe(1);
    });

    it('should focus and blur an input', async () => {
      const input = await loader.getHarness(
        MatAutocompleteHarness.with({ selector: 'input' }),
      );
      expect(await input.isFocused()).toBe(false);
      await input.focus();
      expect(await input.isFocused()).toBe(true);
      await input.blur();
      expect(await input.isFocused()).toBe(false);
    });

    it('should be able to get filtered options', () => {
      jest.spyOn(queryPage, 'fetch').mockReturnValueOnce(
        of({
          loading: false,
          data: {
            findPagesByTitleOrSlug: [],
          },
        } as any),
      );
      component.inputFormControl.setValue('Hello');
      expect(queryPage.fetch).toHaveBeenLastCalledWith({ arg: 'Hello' });
    });

    it('should be able to get filtered options if the input receives page object', () => {
      jest.spyOn(queryPage, 'fetch').mockReturnValueOnce(
        of({
          loading: false,
          data: {
            findPagesByTitleOrSlug: [],
          },
        } as any),
      );
      component.inputFormControl.setValue({ _id: '1', slug: 'hello' });
      expect(queryPage.fetch).toHaveBeenLastCalledWith({ arg: 'hello' });
    });
  });

  describe('isEdit', () => {
    it('should set to true if preselect input is not null and has "_id" defined', () => {
      component.preSelect = { _id: '444', slug: 'test' };
      fixture.detectChanges();

      expect(component.isEdit).toEqual(true);
    });
  });

  describe('displayFn', () => {
    it('should return page slug', () => {
      fixture.detectChanges();
      expect(component.displayFn({ _id: '123', slug: 'foo' })).toEqual('foo');
    });
  });

  describe('selectedOption', () => {
    it('should store and emit selected option', () => {
      fixture.detectChanges();
      jest.spyOn(component.selectedUpdate, 'emit');
      component.selectedOption({
        option: { value: { _id: '1', slug: 'bar' } },
      } as any);
      expect(component.selected).toEqual({ _id: '1', slug: 'bar' });
      expect(component.selectedUpdate.emit).toHaveBeenLastCalledWith(
        component.selected,
      );
    });
  });

  describe('autocompleteFormSubmit', () => {
    it('should prevent default on passed event', () => {
      fixture.detectChanges();
      const mockEvent = {
        preventDefault: jest.fn(),
      };
      component.autocompleteFormSubmit(mockEvent as any);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });
});
