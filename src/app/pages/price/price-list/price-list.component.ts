import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CreatePriceComponent } from "../create-price/create-price.component";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PriceService } from '../../../services/price/price.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { TreeSelectModule } from 'primeng/treeselect';

@Component({
  selector: 'app-price-list',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule, FormsModule, CreatePriceComponent, RouterLink, PaginatorModule, TreeSelectModule],
  providers: [ConfirmationService],
  templateUrl: './price-list.component.html',
  styleUrl: './price-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PriceListComponent implements OnInit {

  selectedColor: any = {}


  priceList: any[] = [];
  displayDialog: boolean = false;

  totalRecords: number = 0; // Tổng số đơn hàng
  totalPages: number = 0; // Tổng số trang
  rowsPerPage: number = 10; // Số đơn hàng mỗi trang
  currentPage: number = 0; // Trang hiện tại

  sortOrder: string = "";
  // Các tùy chọn sắp xếp
  sortOptions: any[] = [
    { label: 'Giá: Mặc định', value: '' },
    { label: 'Giá: Thấp đến Cao', value: 'asc' },
    { label: 'Giá: Cao đến Thấp', value: 'desc' }
  ];

  constructor(
    private priceService: PriceService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadPrices(this.currentPage, this.rowsPerPage);
  }

  loadPrices(page: number, limit: number) {
    this.priceService.getAllPrices(page, limit, this.sortOrder).subscribe((res: any) => {
      this.priceList = res.data.priceResponseList;
      this.totalRecords = res.data.totalRecords;
      this.totalPages = res.data.totalPages;
    })
  }

  onPageChange(event: any): void {
    this.currentPage = event.page; // Cập nhật trang hiện tại
    this.rowsPerPage = event.rows; // Cập nhật số dòng mỗi trang
    this.loadPrices(this.currentPage, this.rowsPerPage);
  }

  onSortOrderChange(event: any): void {
    // const selectElement = event.target as HTMLSelectElement;
    // this.sortOrder = selectElement.value;  // Cập nhật giá trị sortOrder
    this.loadPrices(this.currentPage, this.rowsPerPage);
  }
  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }
}
