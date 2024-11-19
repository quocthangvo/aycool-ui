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

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, CommonModule, ImageModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule, FileUploadModule, FormsModule,
    RouterLink, DropdownModule, ProductDetailListComponent],
  providers: [ConfirmationService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {
  selectedProduct: any = {}

  productList: any[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private productService: ProductService,
    private productDetailService: ProductDetailService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.loadProducts();

  }

  loadProducts() {
    this.productService.getAllProducts(0, 10).subscribe((res: any) => {
      this.productList = res.data.productResponseList;
    });

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

            this.loadProducts(); // Reload 
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
        this.loadProducts();
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
        this.router.navigate(['/update-product', productId]);
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
