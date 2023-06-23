import { HarnessLoader } from '@angular/cdk/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PageFormContentComponent } from './page-form-content.component';

describe('PageFormContentComponent', () => {
  let component: PageFormContentComponent;
  let fixture: ComponentFixture<PageFormContentComponent>;
  let loader: HarnessLoader;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatExpansionModule, NoopAnimationsModule],
      declarations: [PageFormContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageFormContentComponent);
    component = fixture.componentInstance;
    component.content = [];
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  }));

  describe('removeItem', () => {
    it('should remove item from content array', () => {
      component.content = [
        { _id: '123', title: 'Media' },
        { _id: '321', title: 'Text' },
      ];
      fixture.detectChanges();

      jest.spyOn(component.contentUpdate, 'emit');

      component.removeItem(component.content[0]);

      expect(component.contentUpdate.emit).toHaveBeenLastCalledWith([
        { _id: '321', title: 'Text' },
      ]);
    });
  });
});
