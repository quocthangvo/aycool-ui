import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { PriceService } from '../../../services/price/price.service';
import { ProductDetailService } from '../../../services/product/product-detail.service';
import { Router } from '@angular/router';
import { ProductDetail } from '../../../models/product/product-detail.model';
import { PriceDTO } from '../../../dtos/price/price.dto';
import { CalendarModule } from 'primeng/calendar';
import { ProductService } from '../../../services/product/product.service';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProductDetailDTO } from '../../../dtos/product/product-detail.dto';


@Component({
  selector: 'app-create-price',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, ToastModule,
    CommonModule, ReactiveFormsModule, DialogModule, CalendarModule, TableModule, MultiSelectModule],
  providers: [DatePipe],
  templateUrl: './create-price.component.html',
  styleUrl: './create-price.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CreatePriceComponent implements OnInit {

  priceForm: FormGroup;
  submit = false;
  minDate: Date = new Date();
  productList: any[] = [];
  selectedProductDetail: any[] = [];

  productDetails: any[] = []; // lưu ds sản phẩm đã chọn


  constructor(
    private messageService: MessageService,
    private priceService: PriceService,
    private productDetailService: ProductDetailService,
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {
    this.priceForm = this.fb.group({
      selectedProductDetail: ['', [Validators.required]],
      selling_price: ['', [Validators.required]],
      // promotionDiscount: [0, [Validators.min(0), Validators.max(100)]], // Giảm giá phần trăm
      promotion_price: [0, [Validators.min(0), Validators.max(100)]],
      start_date: [[], [Validators.required]],
      end_date: [''],
    });

  }

  ngOnInit(): void {


    this.loadProductDetails();

  }

  get selected() {
    return this.priceForm.get('selectedProductDetail')
  }

  get productDetail() {
    return this.priceForm.get('product_detail_id');
  }
  get sellingPrice() {
    return this.priceForm.get('selling_price');
  }
  get promotionPrice() {
    return this.priceForm.get('promotion_price')
  }
  get startDate() {
    return this.priceForm.get('start_date')
  }
  get endDate() {
    return this.priceForm.get('end_date')
  }



  // loadProductDetails() {
  //   this.productDetailService.getAllProductDetailsNoId().subscribe((res: any) => {
  //     // Ánh xạ dữ liệu trả về
  //     //   this.productList = res.data.map((productDetail: ProductDetail) => ({
  //     //     label: productDetail.sku_name,
  //     //     value: productDetail.id,
  //     //     data: productDetail
  //     //   }));

  //     // });
  //     this.productDetails = res.data;
  //   });
  // }

  loadProductDetails() {
    this.productDetailService.getAllProductDetailsNoId().subscribe(
      (res: any) => {
        if (res && res.data) {
          // Giả sử API trả về một đối tượng với trường 'data'
          this.productList = res.data.map((item: any) => ({
            id: item.id,
            sku_name: item.sku_name
          }));
        }
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
  }

  onProductSelectChange(event: any) {
    // Lấy ID của các sản phẩm đã chọn
    const selectedIds = event.value;

    // Lọc các sản phẩm đã chọn từ danh sách sản phẩm
    this.selectedProductDetail = this.productList.filter(product =>
      selectedIds.includes(product.id)
    );

    console.log('Sản phẩm đã chọn:', this.selectedProductDetail);
  }



  // Tính toán giá khuyến mãi khi giảm giá thay đổi
  onPromotionDiscountChange(detail: any) {
    // Đơn giản chỉ lưu giá trị phần trăm giảm giá vào promotionDiscount
    const promotionDiscount = detail.promotionDiscount; // Lấy phần trăm giảm giá
    if (promotionDiscount >= 0 && promotionDiscount <= 100) {
      // Giữ giá trị phần trăm nhập vào
      detail.promotionPrice = promotionDiscount; // Cập nhật phần trăm giảm giá vào promotionPrice
    } else {
      detail.promotionPrice = 0; // Nếu không hợp lệ, đặt giá khuyến mãi về 0
    }
  }






  // Hàm gửi yêu cầu thêm giá qua API
  // Cập nhật hàm createPrice
  async createPrice() {
    this.submit = true;
    // Kiểm tra xem có sản phẩm được chọn không
    if (this.priceForm.invalid || this.selectedProductDetail.length === 0) {
      console.log('Form không hợp lệ hoặc chưa chọn sản phẩm');
      return;
    }


    let promotionPrice = this.priceForm.value.promotion_price;

    // Ensure promotion_price is not null, default to 0 if not provided
    if (promotionPrice === null || promotionPrice === undefined || isNaN(promotionPrice)) {
      promotionPrice = 0;  // Set to 0 if promotion_price is null or undefined
    }
    const startDate = this.datePipe.transform(this.priceForm.value.start_date, 'yyyy-MM-dd');
    const endDate = this.datePipe.transform(this.priceForm.value.end_date, 'yyyy-MM-dd') || null;

    // Tạo mảng PriceDTO từ selectedProductDetail
    const priceDTOs = this.selectedProductDetail.map((product) => {
      return new PriceDTO({
        product_detail_id: product.id,
        selling_price: this.priceForm.value.selling_price,
        promotion_price: promotionPrice,
        start_date: startDate,
        end_date: endDate  // Nếu không có end_date, để null
      });
    });

    // Gửi yêu cầu POST đến API
    try {
      for (const priceDTO of priceDTOs) {
        const response = await this.priceService.createPrice(priceDTO).toPromise();
        console.log('Thêm giá thành công:', response);
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm giá thành công.' });
        this.router.navigateByUrl("/admin/price")
      }
    } catch (error) {
      console.error('Lỗi khi thêm giá:', error);
      // Xử lý lỗi, ví dụ: thông báo lỗi cho người dùng
    }
  }



  cancel() {
    this.router.navigateByUrl("/admin/price");
  }

}
