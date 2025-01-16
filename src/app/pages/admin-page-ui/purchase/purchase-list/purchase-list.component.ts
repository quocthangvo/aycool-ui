import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { PurchaseService } from '../../../../services/warehouse/purchase.service';
import { SubCategoryService } from '../../../../services/category/sub-category.service';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule,
    FormsModule, PaginatorModule, ImageModule],
  providers: [ConfirmationService],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PurchaseListComponent {
  purchaseList: any[] = [];

  productName: string = ''; // Từ khóa tìm kiếm
  subCategoryId: number | undefined = undefined; // Lựa chọn danh mục con
  subCategories: Array<{ id: number, name: string }> = []; // Danh sách danh mục con

  totalRecords: number = 0; // sluong trang
  rowsPerPage: number = 10;   // Số lượng sp hiện thị mỗi trang
  currentPage: number = 0; // Trang hiện tại bắt đầu từ

  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }

  ngOnInit() {
    this.loadPurchases(this.currentPage, this.rowsPerPage, this.productName, this.subCategoryId);
    this.loadSubCategory();
  }

  constructor(
    private confirmationService: ConfirmationService,
    private purchaseService: PurchaseService,
    private messageService: MessageService,
    private subCategoryService: SubCategoryService
  ) { }

  loadPurchases(page: number, limit: number, productName: string = '', subCategoryId?: number) {
    this.purchaseService.getAllPurchase(page, limit, productName, subCategoryId).subscribe((res) => {
      this.purchaseList = res.data.purchaseList;
      this.totalRecords = res.data.totalRecords; // Cập nhật tổng số bản ghi
    });
  }
  loadSubCategory() {
    this.subCategoryService.getAllSubCategories().subscribe((res) => {  // Lấy danh sách danh mục con
      this.subCategories = res.data;
    });
  }
  onPageChange(event: any) {
    this.currentPage = event.page;
    this.rowsPerPage = event.rows;
    this.loadPurchases(this.currentPage, this.rowsPerPage, this.productName, this.subCategoryId);
  }

  onSearch() {
    this.currentPage = 0; // Reset về trang đầu tiên
    this.loadPurchases(this.currentPage, this.rowsPerPage, this.productName, this.subCategoryId);
  }
  clearSearch() {
    this.productName = ''; // Đặt giá trị của searchName về rỗng
    this.subCategoryId = undefined;
    this.loadPurchases(this.currentPage, this.rowsPerPage, this.productName, this.subCategoryId);

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
        this.purchaseService.deletePurchaseId(id).subscribe(
          (res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa thành công'
            });
            this.loadPurchases(this.currentPage, this.rowsPerPage, this.productName);
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

  displayDialog: boolean = false;
  selectedPurchase: any = {}


  cancelUpdate() {
    this.displayDialog = false; // Close dialog
  }

  onModelUpdate(purchase: any) {
    this.purchaseService.getPurchaseId(purchase.id).subscribe((purchaseData: any) => {
      this.selectedPurchase = { ...purchaseData.data }; // Sao chép danh mục đã chọn để tránh các vấn đề ràng buộc trực tiếp
      this.displayDialog = true; // Show the update dialog
    })

  }

  save() {
    if (this.selectedPurchase && this.selectedPurchase.id) {
      const purchaseId = this.selectedPurchase.id; // id của danh mục ccon

      const updateData = {
        quantity: this.selectedPurchase.quantity,
        price: this.selectedPurchase.price,
      };
      console.log("Sending updateData:", updateData);
      this.purchaseService.updatePurchaseId(purchaseId, updateData).subscribe((res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật danh mục thành công!' });
        this.displayDialog = false; // đóng  dialog
        this.loadPurchases(this.currentPage, this.rowsPerPage, this.productName);

      },
        (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại!' + error.error.message });
        }
      )
    }
  }
}
