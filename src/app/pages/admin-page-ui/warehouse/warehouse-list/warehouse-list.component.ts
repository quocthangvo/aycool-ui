import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TreeSelectModule } from 'primeng/treeselect';
import { WarehouseService } from '../../../../services/warehouse/warehouse.service';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule, FormsModule,
    RouterLink, PaginatorModule, TreeSelectModule, ImageModule],
  providers: [ConfirmationService],
  templateUrl: './warehouse-list.component.html',
  styleUrl: './warehouse-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class WarehouseListComponent {
  warehouseList: any[] = [];

  constructor(
    private warehouseService: WarehouseService,
    private confirmationService: ConfirmationService
  ) {

  }

  ngOnInit() {
    this.loadWarehouse();
  }

  loadWarehouse() {
    this.warehouseService.getAllWarehouse(0, 10).subscribe((res) => {
      this.warehouseList = res.data.warehouseResponseList;
    });
  }

  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }
}
