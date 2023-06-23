import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { PageContentConfirmDialogComponent } from './page-content-confirm-dialog.component';

describe('PageContentConfirmDialogComponent', () => {
  let component: PageContentConfirmDialogComponent;
  let fixture: ComponentFixture<PageContentConfirmDialogComponent>;
  let matDialogRef: MatDialogRef<PageContentConfirmDialogComponent>;
  const mockMatDialogRef = { close: jest.fn() };
  const mockMatDialogData = { message: 'Test', someData: { _id: '1' } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageContentConfirmDialogComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockMatDialogData,
        },
      ],
    }).compileComponents();

    matDialogRef = TestBed.inject(MatDialogRef);
    fixture = TestBed.createComponent(PageContentConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('data', () => {
    it('should be used to display message', () => {
      const messageElement = fixture.debugElement.query(
        By.css('[data-test-message]'),
      );

      expect(messageElement.nativeElement.textContent).toEqual(
        mockMatDialogData.message,
      );
    });
  });

  describe('cancel', () => {
    it('should close dialog', () => {
      component.cancel();

      expect(matDialogRef.close).toHaveBeenCalledTimes(1);
    });
  });
});
