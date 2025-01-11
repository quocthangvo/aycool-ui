import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ProductDetailService } from '../../../../services/product/product-detail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../services/product/product.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UpdateProductDetailComponent } from "../update-product-detail/update-product-detail.component";

@Component({
  selector: 'app-product-detail-list',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, ToastModule,
    CommonModule, ReactiveFormsModule, DialogModule, TableModule, ImageModule, ConfirmDialogModule, UpdateProductDetailComponent],
  providers: [ConfirmationService],
  templateUrl: './product-detail-list.component.html',
  styleUrl: './product-detail-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProductDetailListComponent implements OnChanges {

  @Input() display: boolean = false; // Nhận trạng thái hiển thị từ Parent
  @Input() productId: number | null = null; //nhận id product
  @Output() close = new EventEmitter<void>(); // Phát sự kiện đóng

  productDetailList: any[] = [];
  submit = false;
  selectedProductDetail: any = {};

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private productDetailService: ProductDetailService,
    private router: Router,
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && this.productId) {
      this.loadProductDetails(this.productId);
    }

  } // dùng onchange để gọi lại từng input thay đổi, onInit chỉ gọi 1 lần input k cập nhật thay đổi

  loadProductDetails(productId: number) {
    this.productDetailService.getAllProductDetails(productId).subscribe(
      (res: any) => {
        console.log(res)
        // Lưu trữ dữ liệu sản phẩm vào một biến hoặc bộ nhớ tạm thời
        this.productDetailList = res.data;
      })

  }


  onDelete(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa chi tiết sản phẩm này không?',
      header: 'Xác nhận',
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      accept: () => {
        this.productDetailService.deleteProductDetailById(id).subscribe(
          (res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa thành công'
            });
            if (this.productId) {
              this.loadProductDetails(this.productId); // Use the correct productId
            }
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
        // this.loadProductDetails(id);
      }
    });
  }

  showDialog = false;
  selectedId: number | undefined;

  onModelUpdate(productDetailId: number) {
    this.selectedId = productDetailId;
    this.showDialog = true;

  }

  cancel() {
    this.close.emit(); // Phát sự kiện đóng dialog
  }


}
