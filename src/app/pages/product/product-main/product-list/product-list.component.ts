import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from '../../../../services/product/product.service';
import { ProductDetailListComponent } from "../../product-detail/product-detail-list/product-detail-list.component";
import { ProductDetailService } from '../../../../services/product/product-detail.service';
import { PaginatorModule } from 'primeng/paginator';
import { MaterialService } from '../../../../services/attribute/material.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, CommonModule, ImageModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule, FileUploadModule, FormsModule,
    RouterLink, DropdownModule, ProductDetailListComponent, PaginatorModule],
  providers: [ConfirmationService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {
  selectedProduct: any = {}

  productList: any[] = [];

  totalRecords: number = 0; // Tổng số đơn hàng
  totalPages: number = 0; // Tổng số trang
  rowsPerPage: number = 10; // Số đơn hàng mỗi trang
  currentPage: number = 0; // Trang hiện tại

  materials: any[] = []; // Danh sách chất liệu từ API
  searchName: string = ''; // Tên sản phẩm tìm kiếm
  selectedMaterial: number | null = null; // Chất liệu được chọn

  noResults: boolean = false; // Biến để kiểm tra có sản phẩm không

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private productService: ProductService,
    private productDetailService: ProductDetailService,
    private router: Router,
    private materialService: MaterialService
  ) { }


  ngOnInit(): void {
    this.fetchMaterials(); // Lấy danh sách chất liệu
    this.loadProducts(this.currentPage, this.rowsPerPage);

  }

  // Lấy danh sách chất liệu
  fetchMaterials(): void {
    this.materialService.getAllMaterials().subscribe((res: any) => {
      this.materials = res.data;
    });
  }

  // Tải danh sách sản phẩm với các tham số tìm kiếm và lọc
  loadProducts(page: number, limit: number): void {
    this.productService
      .getAllProducts(page, limit, this.searchName, this.selectedMaterial) // Truyền thêm tham số lọc
      .subscribe((res: any) => {
        this.productList = res.data.productResponseList;
        this.totalRecords = res.data.totalRecords;
        this.totalPages = res.data.totalPages;
        this.noResults = this.productList.length === 0; // Cập nhật biến noResults
      });
  }


  // Xử lý thay đổi khi nhấn nút Lọc
  onFilterClick(): void {
    this.currentPage = 0; // Reset về trang đầu
    this.loadProducts(this.currentPage, this.rowsPerPage); // Gọi lại loadProducts với tham số lọc
  }

  // Xử lý xóa bộ lọc và tìm kiếm
  clear(): void {
    this.searchName = ''; // Xóa tìm kiếm
    this.selectedMaterial = null; // Xóa chất liệu lọc
    this.currentPage = 0; // Reset về trang đầu
    this.loadProducts(this.currentPage, this.rowsPerPage); // Gọi lại loadProducts mà không có lọc
  }


  //phan trang
  onPageChange(event: any): void {
    this.currentPage = event.page; // Cập nhật trang hiện tại
    this.rowsPerPage = event.rows; // Cập nhật số dòng mỗi trang
    this.loadProducts(this.currentPage, this.rowsPerPage);
  }

  onDelete(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa sản phẩm không?',
      header: 'Xác nhận',
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      accept: () => {
        this.productService.deleteProductById(id).subscribe(
          (res: any) => {
            console.log("id", id)

            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa thành công'
            });

            this.loadProducts(this.currentPage, this.rowsPerPage); // Reload 
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
      reject: () => {
        this.loadProducts(this.currentPage, this.rowsPerPage);
      }
    });
  }


  onModelUpdate(productId: number) {
    // Gọi API để lấy thông tin sản phẩm theo ID
    this.productService.getProductById(productId).subscribe(
      (productData: any) => {
        // Lưu trữ dữ liệu sản phẩm vào một biến hoặc bộ nhớ tạm thời
        this.selectedProduct = productData;

        // Điều hướng sang trang cập nhật với ID của sản phẩm
        this.router.navigate(['/admin/update-product', productId]);
      }

    );
  }

  showProductDialog = false;
  selectedProductId: number | undefined;
  // Mở dialog với thông tin chi tiết sản phẩm
  // Mở dialog với thông tin chi tiết sản phẩm
  openDialog(productId: number) {
    this.selectedProductId = productId;
    console.log("id", productId);
    this.showProductDialog = true;
  }

}
