import {
  Component,
  Input,
  EventEmitter,
  OnChanges,
  Output,
  SimpleChanges,
  SimpleChange,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { adminDateTimeFormat } from '../../app.constants';
import { PageContentConfirmDialogComponent } from '../page-content-confirm-dialog/page-content-confirm-dialog.component';
import {
  PageContentListColumn,
  PageContentListColumnAction,
  PageContentListColumnType,
  PageContentListRow,
} from './page-content-list-layout.interface';

@Component({
  selector: 'admin-page-content-list-layout',
  templateUrl: './page-content-list-layout.component.html',
  styleUrls: ['./page-content-list-layout.component.scss'],
})
export class PageContentListLayoutComponent
  implements OnChanges, AfterViewInit
{
  @Input() rows!: PageContentListRow[];
  @Input() columns!: PageContentListColumn[];
  @Input() emptyDataMessage!: string;
  @Input() actionConfirmUseRowProperty!: string;
  @Output() editActionEmitter = new EventEmitter<PageContentListRow>();
  @Output() viewActionEmitter = new EventEmitter<PageContentListRow>();
  @Output() deleteActionEmitter = new EventEmitter<PageContentListRow>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataInput = new MatTableDataSource<PageContentListRow>();
  columnsInput!: PageContentListColumn[];
  displayedColumns!: string[];
  dateTimeFormat = adminDateTimeFormat;

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges) {
    this.columnsChangeHandler(changes['columns']);
    this.rowsChangeHandler(changes['rows']);
  }

  ngAfterViewInit() {
    this.dataInput.paginator = this.paginator;
    this.dataInput.sort = this.sort;
  }

  actionHandler(columnAction: string, row: PageContentListRow) {
    const action = columnAction as PageContentListColumnAction;

    if (action === PageContentListColumnAction.delete) {
      this.openConfirmDeleteDialog(row);
      return;
    }
    this.triggerAction(action, row);
  }

  getColumnType(column: PageContentListColumn): PageContentListColumnType {
    if (column && column.type) {
      return column.type;
    }
    return 'string';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataInput.filter = filterValue.trim().toLowerCase();

    if (this.dataInput.paginator) {
      this.dataInput.paginator.firstPage();
    }
  }

  private get actionColumns() {
    return [
      {
        columnDef: `${PageContentListColumnAction.view}`,
        header: 'View',
        cell: () => 'visibility',
      },
      {
        columnDef: `${PageContentListColumnAction.edit}`,
        header: 'Edit',
        cell: () => 'edit',
      },
      {
        columnDef: `${PageContentListColumnAction.delete}`,
        header: 'Delete',
        cell: () => 'delete',
      },
    ];
  }

  private openConfirmDeleteDialog(row: PageContentListRow) {
    this.dialog
      .open(PageContentConfirmDialogComponent, {
        closeOnNavigation: true,
        data: {
          message: `Are you sure you want to delete "${
            row[this.actionConfirmUseRowProperty]
          }"?`,
          payload: row,
        },
      })
      .afterClosed()
      .subscribe(this.confirmDialogAfterClosedHandler.bind(this));
  }

  private confirmDialogAfterClosedHandler(result: PageContentListRow | null) {
    if (result == null) {
      return;
    }
    this.triggerAction(PageContentListColumnAction.delete, result);
  }

  private columnsChangeHandler(columnsChange: SimpleChange) {
    if (columnsChange && columnsChange.currentValue != null) {
      this.columnsInput = [...this.columns, ...this.actionColumns];
      this.displayedColumns = this.columnsInput.map((c) => c.columnDef);
    }
  }

  private rowsChangeHandler(rowsChange: SimpleChange) {
    if (rowsChange && rowsChange.currentValue != null) {
      this.dataInput.data = this.rows;
    }
  }

  private triggerAction(
    action: PageContentListColumnAction,
    row: PageContentListRow,
  ) {
    if (action === PageContentListColumnAction.edit) {
      this.editActionEmitter.emit(row);
      return;
    }

    if (action === PageContentListColumnAction.view) {
      this.viewActionEmitter.emit(row);
      return;
    }

    if (action === PageContentListColumnAction.delete) {
      this.deleteActionEmitter.emit(row);
      return;
    }
  }
}
