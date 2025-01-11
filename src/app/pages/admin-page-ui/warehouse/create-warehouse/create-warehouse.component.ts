import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ProductDetailService } from '../../../../services/product/product-detail.service';
import { PurchaseService } from '../../../../services/warehouse/purchase.service';
import { MessageService } from 'primeng/api';
import { PurchaseDTO } from '../../../../dtos/purchase/purchase.dto';

@Component({
  selector: 'app-create-warehouse',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, ToastModule,
    CommonModule, ReactiveFormsModule, DialogModule, CalendarModule,
    TableModule, MultiSelectModule, ImageModule],
  templateUrl: './create-warehouse.component.html',
  styleUrl: './create-warehouse.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CreateWarehouseComponent {

  purchaseForm: FormGroup;
  submit = false;

  productList: any[] = [];
  selectedProductDetails: any[] = [];


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private productDetailService: ProductDetailService,
    private purchaseService: PurchaseService,
    private messageService: MessageService
  ) {
    this.purchaseForm = this.fb.group({
      selectedProductDetail: [[], Validators.required],
      purchases: this.fb.array([])
    });

  }

  ngOnInit(): void {
    this.loadProductDetails();
  }

  loadProductDetails() {
    this.productDetailService.getAllProductDetailsNoId().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.productList = res.data.map((item: any) => ({
            id: item.id,
            sku_name: item.sku_name,
            product_id: item.product_id,
            productImages: item.product_id?.productImages,
          }));
        }
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
  }

  onProductSelectChange(event: any) {
    const selectedIds = event.value;
    // Lọc các sản phẩm được chọn từ danh sách sản phẩm
    const updatedProducts = this.productList.filter((product) =>
      selectedIds.includes(product.id)
    );

    // Xóa các sản phẩm không được chọn khỏi FormArray
    this.purchase.clear();

    // Thêm các sản phẩm đã chọn vào FormArray
    updatedProducts.forEach((product) => {
      this.purchase.push(
        this.fb.group({
          product_detail_id: [product.id], // ID của chi tiết sản phẩm
          quantity: ['', [Validators.required, Validators.min(1)]], // Số lượng (bắt buộc)
          price: ["", [Validators.required, Validators.min(1)]], // Giá (bắt buộc, phải lớn hơn 0)
        })
      );
    });

    // Lưu danh sách sản phẩm đã chọn để hiển thị
    this.selectedProductDetails = updatedProducts;
  }




  get purchase(): FormArray {
    return this.purchaseForm.get('purchases') as FormArray;
  }
  cancel() {
    this.router.navigateByUrl("/admin/warehouse");
  }
  removeProduct(index: number): void {
    // Xóa sản phẩm khỏi mảng selectedProductDetails
    this.selectedProductDetails.splice(index, 1);

    // Xóa sản phẩm khỏi FormArray
    this.purchase.removeAt(index);

    // Cập nhật lại giá trị của p-multiSelect
    // Loại bỏ id của sản phẩm đã xóa khỏi giá trị đã chọn của p-multiSelect
    const updatedSelectedIds = this.purchase.controls.map((control: any) => control.get('product_detail_id').value);
    this.purchaseForm.get('selectedProductDetail')?.setValue(updatedSelectedIds);

    // Cập nhật lại danh sách sản phẩm trong form
    this.purchase.updateValueAndValidity();
  }

  createPurchase() {
    this.submit = true;  // Đánh dấu form đã được gửi

    // Kiểm tra tính hợp lệ của form
    if (this.purchaseForm.invalid) {
      console.log('Form không hợp lệ.');
      return;  // Nếu form không hợp lệ, dừng lại
    }

    const formValues = this.purchaseForm.value;

    // Tạo một đối tượng PurchaseDTO cho mỗi sản phẩm đã chọn
    const purchases = formValues.purchases.map((purchase: any) => ({
      quantity: purchase.quantity,
      price: purchase.price,
      product_detail_id: purchase.product_detail_id
    }));

    console.log("Danh sách đơn hàng:", purchases);

    // Gọi API thông qua service
    this.purchaseService.createPurchase(purchases).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Tạo đơn nhập hàng thành công.' });
        this.router.navigateByUrl('/admin/warehouse');
      },
      (error) => {
        console.error('Lỗi khi tạo đơn nhập hàng:', error);
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Đã có lỗi xảy ra khi tạo đơn nhập hàng.' });
      }
    );
  }







}
