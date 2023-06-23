import 'zone.js';
// import 'zone.js/dist/zone-testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PageContentListLayoutComponent } from './page-content-list-layout.component';
import { PageContentListColumnAction } from './page-content-list-layout.interface';
import { of } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';

describe('PageContentListLayoutComponent', () => {
  let component: PageContentListLayoutComponent;
  let fixture: ComponentFixture<PageContentListLayoutComponent>;
  let loader: HarnessLoader;
  let matDialog: MatDialog;
  const mockColumns = [
    {
      columnDef: 'key1',
      header: 'Foo',
      cell: jest.fn(),
    },
    {
      columnDef: 'key2',
      header: 'Bar',
      cell: jest.fn(),
    },
  ];
  const mockRows = [
    {
      key1: 1,
      key2: 'test',
    },
  ];
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageContentListLayoutComponent],
      imports: [MatDialogModule, NoopAnimationsModule, MatPaginatorModule],
    }).compileComponents();

    matDialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(PageContentListLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  }));

  describe('columns', () => {
    it('should set columnsInput and displayedColumn by merging columns and action columns', () => {
      component.columns = mockColumns;
      component.ngOnChanges({
        columns: {
          currentValue: mockColumns,
          isFirstChange: () => false,
          firstChange: false,
          previousValue: undefined,
        },
      });
      expect(component.columnsInput.length).toEqual(mockColumns.length + 3);
      expect(component.displayedColumns.length).toEqual(mockColumns.length + 3);

      const actionColumns = component.columnsInput.slice(mockColumns.length);

      expect(actionColumns[0].columnDef).toEqual(
        PageContentListColumnAction.view,
      );
      expect(actionColumns[0].header).toEqual('View');
      expect(actionColumns[0].cell()).toEqual('visibility');

      expect(actionColumns[1].columnDef).toEqual(
        PageContentListColumnAction.edit,
      );
      expect(actionColumns[1].header).toEqual('Edit');
      expect(actionColumns[1].cell()).toEqual('edit');

      expect(actionColumns[2].columnDef).toEqual(
        PageContentListColumnAction.delete,
      );
      expect(actionColumns[2].header).toEqual('Delete');
      expect(actionColumns[2].cell()).toEqual('delete');
    });
  });

  describe('rows', () => {
    it('should set rows data as mata table data input', () => {
      component.rows = mockRows;
      component.ngOnChanges({
        rows: {
          currentValue: mockRows,
          isFirstChange: () => false,
          firstChange: false,
          previousValue: undefined,
        },
      });
      expect(component.dataInput.data.length).toEqual(mockRows.length);
      expect(component.dataInput.data[0]).toEqual(mockRows[0]);
    });
  });

  describe('actionHandler', () => {
    it('should only emit instant event if action is not "delete"', () => {
      jest.spyOn(component.viewActionEmitter, 'emit');
      jest.spyOn(component.editActionEmitter, 'emit');
      component.actionConfirmUseRowProperty = 'key1';
      fixture.detectChanges();

      component.actionHandler(PageContentListColumnAction.view, mockRows[0]);
      expect(component.viewActionEmitter.emit).toHaveBeenLastCalledWith(
        mockRows[0],
      );

      component.actionHandler(PageContentListColumnAction.edit, mockRows[1]);
      expect(component.editActionEmitter.emit).toHaveBeenLastCalledWith(
        mockRows[1],
      );
    });
  });

  describe('getColumnType', () => {
    it('should return column type or "string"', () => {
      const typeString = component.getColumnType({} as any);
      const typeFromColumn = component.getColumnType({
        type: 'date',
        ...mockColumns[1],
      });
      expect(typeString).toEqual('string');
      expect(typeFromColumn).toEqual('date');
    });
  });

  describe('applyFilter', () => {
    it('should set filter on data source and reset paginator to first page', () => {
      const spyOnPaginator = jest.spyOn(
        component.dataInput.paginator as any,
        'firstPage',
      );
      component.applyFilter({ target: { value: 'Foo' } } as any);
      expect(component.dataInput.filter).toEqual('foo');
      expect(spyOnPaginator).toHaveBeenCalled();
    });
  });

  describe('confirm delete', () => {
    const setComponentInputs = () => {
      component.columns = mockColumns;
      component.ngOnChanges({
        columns: {
          currentValue: mockColumns,
          isFirstChange: () => false,
          firstChange: false,
          previousValue: undefined,
        },
      });
      component.rows = mockRows;
      component.ngOnChanges({
        rows: {
          currentValue: mockRows,
          isFirstChange: () => false,
          firstChange: false,
          previousValue: undefined,
        },
      });
      component.actionConfirmUseRowProperty = 'key1';
      fixture.detectChanges();
    };

    it('should open confirm delete dialog emit action when resolved with data', async () => {
      setComponentInputs();
      jest.spyOn(component.deleteActionEmitter, 'emit');
      component.actionHandler(PageContentListColumnAction.delete, mockRows[0]);
      let dialogs = await loader.getAllHarnesses(MatDialogHarness);

      expect(dialogs.length).toBe(1);
      await dialogs[0].close();

      dialogs = await loader.getAllHarnesses(MatDialogHarness);
      expect(dialogs.length).toBe(0);
      expect(component.deleteActionEmitter.emit).not.toHaveBeenCalled();
    });

    it('should open confirm delete dialog and NOT emit action when resolved with nullish', () => {
      setComponentInputs();
      jest.spyOn(component.deleteActionEmitter, 'emit');
      jest.spyOn(matDialog, 'open').mockReturnValueOnce({
        afterClosed: jest.fn().mockReturnValue(of(mockRows[0])),
      } as any);
      component.actionHandler(PageContentListColumnAction.delete, mockRows[0]);
      expect(component.deleteActionEmitter.emit).toHaveBeenLastCalledWith(
        mockRows[0],
      );
    });
  });
});
