import { Component } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngneat/effects-ng';
import { Subject } from 'rxjs';
import { LoggerService } from 'shared-lib';
import { PageWithChildDrawerComponent } from './page-with-child-drawer.component';

const dataSource$ = new Subject();
const mockDataSourceWatchValue = {
  valueChanges: dataSource$.asObservable(),
  refetch: jest.fn().mockResolvedValue([]),
};
const mockDataSource = {
  watch: jest.fn().mockReturnValue(mockDataSourceWatchValue),
};
const mockActions = {
  dispatch: jest.fn(),
};
const mockLoggerService = {
  error: jest.fn(),
};

@Component({
  selector: 'admin-test-page-with-drawer',
  template: '<div></div>',
})
export class TestPageWithDrawerComponent extends PageWithChildDrawerComponent<any> {
  constructor(router: Router, actions: Actions, logger: LoggerService) {
    super(router, actions, logger);
    this.dataSource = mockDataSource as any;
    this.dataSourceUpdateFunction = this.testDataUpdateCallback;
  }

  testDataUpdateCallback = jest.fn();
}

@Component({
  template: `Component 1`,
})
export class OneComponent {}

@Component({
  template: `Component 1 Child`,
})
export class OneChildComponent {}

@Component({
  template: `Component 2`,
})
export class TwoComponent {}

describe('PageWithChildDrawerComponent', () => {
  let component: TestPageWithDrawerComponent;
  let fixture: ComponentFixture<TestPageWithDrawerComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestPageWithDrawerComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'one',
            component: OneComponent,
            children: [
              {
                path: ':id',
                component: OneChildComponent,
              },
            ],
          },
          { path: 'two', component: TwoComponent },
        ]),
      ],
      providers: [
        { provide: Actions, useValue: mockActions },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    jest.spyOn(router.events, 'subscribe');
    fixture = TestBed.createComponent(TestPageWithDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should subscribe to router events and data source update when current view has no child', () => {
    expect(router.events.subscribe).toHaveBeenCalled();
    expect(component.hasChildView).toEqual(false);
    expect(mockDataSource.watch).toBeCalledTimes(1);
  });

  it('should call data source update function passing data source updates when not loading', () => {
    component.testDataUpdateCallback.mockClear();
    dataSource$.next({ loading: true });
    expect(component.testDataUpdateCallback).not.toHaveBeenCalled();
    dataSource$.next({ loading: false, data: { foo: 'bar' } });
    expect(component.testDataUpdateCallback).toHaveBeenCalledWith({
      foo: 'bar',
    });
  });

  describe('hasChildView', () => {
    it('should be set to true when active route has children and child view is active', fakeAsync(() => {
      router.navigate(['/two']);
      tick();
      expect(component.hasChildView).toEqual(false);
      router.navigate(['/one', 'foo']);
      tick();
      expect(component.hasChildView).toEqual(true);
      router.navigate(['/one']);
      tick();
      expect(component.hasChildView).toEqual(false);
    }));
  });

  describe('routeChangeHandler', () => {
    it('should refetch data if current navigation contains state', async () => {
      await router.navigateByUrl('one', { state: { refetch: true } });
      expect(mockDataSourceWatchValue.refetch).toHaveBeenCalled();
      (mockDataSourceWatchValue.refetch as jest.Mock).mockClear();
      await router.navigateByUrl('one');
      expect(mockDataSourceWatchValue.refetch).not.toHaveBeenCalled();
    });
  });
});
