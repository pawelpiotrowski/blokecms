import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User } from 'shared-lib';
import { adminDateTimeFormat } from '../../../app.constants';

@Component({
  selector: 'admin-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent implements OnChanges {
  @Input() user!: User;
  createdByUserId!: string;
  dateTimeFormat = adminDateTimeFormat;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && changes['user'].currentValue != null) {
      this.setCreatedBy();
    }
  }

  private setCreatedBy() {
    this.createdByUserId = this.user.createdBy as string;
  }
}
