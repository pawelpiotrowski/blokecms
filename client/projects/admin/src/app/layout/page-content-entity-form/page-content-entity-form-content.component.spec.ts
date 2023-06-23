import { Component, NgModule } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  MatAccordionHarness,
  MatExpansionPanelHarness,
} from '@angular/material/expansion/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PageContentEntityFormContentComponent } from './page-content-entity-form-content.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-test-page-content-entity-form-content',
  template: `
    <mat-accordion
      multi
      cdkDropList
      (cdkDropListDropped)="dropSortBlocks($event)"
      *ngIf="content?.length"
    >
      <mat-expansion-panel>
        <mat-expansion-panel-header> Panel label </mat-expansion-panel-header>
      </mat-expansion-panel>
    </mat-accordion>
  `,
})
export class TestPageContentEntityFormContentComponent extends PageContentEntityFormContentComponent<any> {}

@NgModule({
  declarations: [TestPageContentEntityFormContentComponent],
  imports: [CommonModule, DragDropModule, MatExpansionModule],
})
export class TestPageContentEntityFormContentModule {}

describe('PageContentEntityFormContentComponent', () => {
  let component: TestPageContentEntityFormContentComponent;
  let fixture: ComponentFixture<TestPageContentEntityFormContentComponent>;
  let loader: HarnessLoader;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatExpansionModule, NoopAnimationsModule],
      declarations: [TestPageContentEntityFormContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      TestPageContentEntityFormContentComponent,
    );
    component = fixture.componentInstance;
    component.content = [];
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  }));

  describe('ngOnChanges', () => {
    it('should not create accordion instance if content is empty', async () => {
      const accordions = await loader.getAllHarnesses(MatAccordionHarness);
      expect(accordions.length).toBe(0);
    });

    it('should create accordion instance if content is not empty', async () => {
      component.content = [{ _id: '123', title: 'Text' }];
      fixture.detectChanges();
      const accordions = await loader.getAllHarnesses(MatAccordionHarness);
      expect(accordions.length).toBe(1);
    });

    it('should not attempt to toggle accordion if content is empty', async () => {
      await loader.getAllHarnesses(MatAccordionHarness);

      component.ngOnChanges({
        expanded: {
          currentValue: true,
          isFirstChange: () => false,
          firstChange: false,
          previousValue: undefined,
        },
      });

      expect(component.accordion).toBeUndefined();
    });

    it('should toggle accordion expanded state if expanded is not first change and not nullish', async () => {
      component.content = [{ _id: '123', title: 'Text' }];
      fixture.detectChanges();

      const panel = await loader.getHarness(MatExpansionPanelHarness);
      expect(await panel.isExpanded()).toBe(false);

      component.ngOnChanges({
        expanded: {
          currentValue: true,
          isFirstChange: () => false,
          firstChange: false,
          previousValue: undefined,
        },
      });

      expect(await panel.isExpanded()).toBe(true);

      component.ngOnChanges({
        expanded: {
          currentValue: false,
          isFirstChange: () => true,
          firstChange: true,
          previousValue: undefined,
        },
      });

      expect(await panel.isExpanded()).toBe(true);

      component.ngOnChanges({
        expanded: {
          currentValue: false,
          isFirstChange: () => false,
          firstChange: false,
          previousValue: undefined,
        },
      });

      expect(await panel.isExpanded()).toBe(false);
    });
  });

  describe('dropSortBlocks', () => {
    it('should move item in content array', () => {
      const mockDragEvent: any = {
        previousIndex: 0,
        currentIndex: 1,
      };
      component.content = [
        { _id: '123', title: 'Media' },
        { _id: '321', title: 'Text' },
      ];
      fixture.detectChanges();

      jest.spyOn(component.contentUpdate, 'emit');

      component.dropSortBlocks(mockDragEvent);

      expect(component.contentUpdate.emit).toHaveBeenLastCalledWith([
        { _id: '321', title: 'Text' },
        { _id: '123', title: 'Media' },
      ]);
    });
  });

  describe('dragHandleClickHandler', () => {
    it('should stop event propagation', () => {
      fixture.detectChanges();
      const mockEvent = { stopPropagation: jest.fn() };

      component.dragHandleClickHandler(mockEvent as any);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });
});
