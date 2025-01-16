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
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-price-list',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule, FormsModule,
    RouterLink, PaginatorModule, TreeSelectModule, ImageModule],
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

  sortOrder: string = ""; // Sắp xếp theo ngày tạo
  search: string = '';  // Biến lưu giá trị tìm kiếm

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

  loadPrices(page: number, limit: number, sort?: string, productDetailName?: string) {
    this.priceService.getAllPricesByFilter(page, limit, sort, productDetailName).subscribe((res: any) => {
      this.priceList = res.data.priceResponseList || [];
      this.totalRecords = res.data.totalRecords || 0;
      this.totalPages = res.data.totalPages || 0;
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.rowsPerPage = event.rows;
    this.loadPrices(this.currentPage, this.rowsPerPage, this.sortOrder, this.search);
  }


  onSortOrderChange(event: any): void {
    this.sortOrder = event.value;
    this.currentPage = 0; // Reset về trang đầu tiên khi sắp xếp thay đổi
    this.loadPrices(this.currentPage, this.rowsPerPage, this.sortOrder, this.search);
  }


  onSearch(): void {
    this.currentPage = 0; // Reset về trang đầu tiên khi tìm kiếm
    this.loadPrices(this.currentPage, this.rowsPerPage, this.sortOrder, this.search.trim());
  }

  onClear(): void {
    this.search = ''; // Xóa từ khóa tìm kiếm
    this.sortOrder = ''; // Reset sắp xếp về mặc định
    this.currentPage = 0; // Reset về trang đầu tiên
    this.loadPrices(this.currentPage, this.rowsPerPage); // Tải lại dữ liệu
  }


  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }
  onDelete(id: number, event: Event) {
    console.log('Price ID to delete:', id);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa giá này không?',
      header: 'Xác nhận',
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      accept: () => {
        this.priceService.deletePriceById(id).subscribe(
          (res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa thành công'
            });
            this.loadPrices(this.currentPage, this.rowsPerPage);
          },
          (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: '' + error.error.message
            });
          }
        );
      },

    });
  }

}
