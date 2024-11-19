import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProductDetailService } from '../../../../services/product/product-detail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailListComponent } from '../product-detail-list/product-detail-list.component';
import { Color } from '../../../../models/attribute/color.model';
import { ColorService } from '../../../../services/attribute/color.service';
import { SizeService } from '../../../../services/attribute/size.service';
import { Size } from '../../../../models/attribute/size.model';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-update-product-detail',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule,
    CommonModule, ReactiveFormsModule, DialogModule, InputTextareaModule, DropdownModule],
  templateUrl: './update-product-detail.component.html',
  styleUrl: './update-product-detail.component.scss'
})
export class UpdateProductDetailComponent implements OnChanges {

  productDetailForm: FormGroup;
  submit = false;
  selectedProductDetail: any;

  @Input() display: boolean = false; // Nhận trạng thái hiển thị từ Parent
  @Input() productDetailId: number | undefined;
  @Output() close = new EventEmitter<void>(); // Phát sự kiện đóng
  @Output() refresh = new EventEmitter<void>();

  constructor(
    private messageService: MessageService,
    private productDetailService: ProductDetailService,
    private fb: FormBuilder,
    private colorService: ColorService,
    private sizeService: SizeService,

  ) {
    this.productDetailForm = this.fb.group({
      sku_version: ['', [Validators.required, Validators.minLength(3)]],
      color_id: ['', [Validators.required]],
      size_id: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productDetailId'] && this.productDetailId) {
      this.loadProductDetails(this.productDetailId);
    }
    this.loadColorOptions();
    this.loadSizeOptions();
  }

  loadProductDetails(productDetailId: number) {
    this.productDetailService.getProductDetailById(productDetailId).subscribe(
      (res: any) => {
        // Lưu trữ dữ liệuvào một biến hoặc bộ nhớ tạm thời
        this.selectedProductDetail = res.data;
        this.productDetailForm.patchValue({
          sku_version: this.selectedProductDetail.sku_version,
          color_id: this.selectedProductDetail.color_id.id,
          size_id: this.selectedProductDetail.size_id.id,
          quantity: this.selectedProductDetail.quantity,
        });
        // this.selectedProductDetail = { ...res.data }; // sao chép ra select
      })
  }


  get skuVerion() {
    return this.productDetailForm.get('sku_version');
  } //đặt tên là để k phải truyền phần submit && ...Form.get('...') vào từng phần để validator
  get color() {
    return this.productDetailForm.get('color_id');
  }
  get size() {
    return this.productDetailForm.get('size_id');
  }
  get quantity() {
    return this.productDetailForm.get('quantity');
  }

  update() {
    this.submit = true;
    const id = this.selectedProductDetail.id;
    const updateData = this.productDetailForm.value;
    console.log("Sending updateData:", updateData);
    this.productDetailService.updateProductDetailById(id, updateData).subscribe((res: any) => {
      this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công!' });
      this.close.emit();
      this.refresh.emit()

    },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại!' + error.error.message });
      }
    )
  }

  cancel() {
    this.productDetailForm.reset;
    this.close.emit(); // Phát sự kiện đóng dialog 
  }

  colorNodes: any[] = [];;
  sizeNodes: any[] = [];;
  loadColorOptions() {
    this.colorService.getAllColors().subscribe((res: any) => {
      // Ánh xạ dữ liệu trả về vào categoryNodes
      this.colorNodes = res.data.map((color: Color) => ({
        label: color.name, // Tên 
        value: color.id,    // ID 

      }));
    });
  }
  loadSizeOptions() {
    this.sizeService.getAllSizes().subscribe((res: any) => {
      // Ánh xạ dữ liệu trả về vào categoryNodes
      this.sizeNodes = res.data.map((size: Size) => ({
        label: size.name, // Tên 
        value: size.id,    // ID 
        description: size.description
      }));
    });
  }


}
