import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CouponDTO } from '../../../dtos/coupon/coupon.dto';
import { CouponService } from '../../../services/coupon/coupon.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-coupon',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule,
    CommonModule, ReactiveFormsModule, DialogModule],
  providers: [ConfirmationService],
  templateUrl: './update-coupon.component.html',
  styleUrl: './update-coupon.component.scss'
})
export class UpdateCouponComponent {
  subCouponForm: FormGroup;
  submit = false;
  couponId: number | null = null;


  constructor(
    private fb: FormBuilder,
    private couponService: CouponService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService

  ) {
    // Define form group with initial empty values
    this.subCouponForm = this.fb.group({
      code: ['', Validators.required],
      description: ['', Validators.required],
      discountType: ['', Validators.required],
      discountValue: ['', [Validators.required, Validators.min(1)]],
      minOrderValue: ['', [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      usageLimit: ['', [Validators.required, Validators.min(1)]],
      status: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.couponId = +this.route.snapshot.paramMap.get('id')!; // Lấy id từ URL
    this.couponService.getCouponById(this.couponId).subscribe((res) => {
      // Chỉ lấy dữ liệu từ res.data
      this.subCouponForm.patchValue(res.data); // Điền dữ liệu vào form
    });
  }


  // updateCoupon(): void {
  //   this.submit = true;

  //   if (this.subCouponForm.valid && this.couponId !== null) {
  //     // Lấy giá trị từ form
  //     const updatedCoupon: CouponDTO = { ...this.subCouponForm.value };
  //     // Đảm bảo ngày bắt đầu và ngày kết thúc là chuỗi theo định dạng yyyy-MM-dd
  //     updatedCoupon.start_date = this.subCouponForm.get('startDate')?.value;
  //     updatedCoupon.end_date = this.subCouponForm.get('endDate')?.value;

  //     // Đảm bảo rằng các trường không thay đổi sẽ giữ lại giá trị cũ
  //     const currentCoupon = this.subCouponForm.getRawValue(); // Lấy tất cả giá trị hiện tại của form (bao gồm cả giá trị cũ)

  //     // Nếu trường nào không thay đổi, giữ lại giá trị cũ
  //     if (!this.subCouponForm.get('code')?.dirty) {
  //       updatedCoupon.code = currentCoupon.code; // Giữ giá trị cũ của mã
  //     }
  //     if (!this.subCouponForm.get('description')?.dirty) {
  //       updatedCoupon.description = currentCoupon.description; // Giữ giá trị cũ của mô tả
  //     }
  //     if (!this.subCouponForm.get('discountType')?.dirty) {
  //       updatedCoupon.discount_type = currentCoupon.discountType; // Giữ giá trị cũ của discountType
  //     }
  //     if (!this.subCouponForm.get('discountValue')?.dirty) {
  //       updatedCoupon.discount_value = currentCoupon.discountValue; // Giữ giá trị cũ của discountValue
  //     }
  //     if (!this.subCouponForm.get('minOrderValue')?.dirty) {
  //       updatedCoupon.min_order_value = currentCoupon.minOrderValue; // Giữ giá trị cũ của minOrderValue
  //     }
  //     if (!this.subCouponForm.get('startDate')?.dirty) {
  //       updatedCoupon.start_date = currentCoupon.startDate; // Giữ giá trị cũ của startDate
  //     }
  //     if (!this.subCouponForm.get('endDate')?.dirty) {
  //       updatedCoupon.end_date = currentCoupon.endDate; // Giữ giá trị cũ của endDate
  //     }
  //     if (!this.subCouponForm.get('usageLimit')?.dirty) {
  //       updatedCoupon.usage_limit = currentCoupon.usageLimit; // Giữ giá trị cũ của usageLimit
  //     }
  //     if (!this.subCouponForm.get('status')?.dirty) {
  //       updatedCoupon.status = currentCoupon.status; // Giữ giá trị cũ của status
  //     }

  //     // Gọi API cập nhật
  //     this.couponService.updateCouponById(this.couponId, updatedCoupon).subscribe(
  //       (response) => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Cập nhật thành công',
  //           detail: 'Mã giảm giá đã được cập nhật'
  //         });
  //         this.router.navigateByUrl('/admin/coupon'); // Redirect to coupon list after update
  //       },
  //       (error) => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Cập nhật thất bại',
  //           detail: 'Có lỗi xảy ra khi cập nhật mã giảm giá'
  //         });
  //       }
  //     );
  //   }
  // }


  cancel(): void {
    this.router.navigateByUrl('/admin/coupon');
  }

  updateCoupon(): void {
    this.submit = true;

    if (this.subCouponForm.valid && this.couponId !== null) {
      // Lấy giá trị từ form
      const updatedCoupon: CouponDTO = { ...this.subCouponForm.value };

      // Đảm bảo ngày bắt đầu và ngày kết thúc là chuỗi theo định dạng yyyy-MM-dd
      updatedCoupon.start_date = this.subCouponForm.get('startDate')?.value;
      updatedCoupon.end_date = this.subCouponForm.get('endDate')?.value;

      // Kiểm tra nếu ngày hiện tại trừ ngày kết thúc = 0, thì cập nhật trạng thái thành false
      const currentDate = new Date();
      const endDate = new Date(updatedCoupon.end_date);

      // Kiểm tra nếu ngày hiện tại >= ngày kết thúc
      if (currentDate.setHours(0, 0, 0, 0) >= endDate.setHours(0, 0, 0, 0)) {
        updatedCoupon.status = false;  // Cập nhật trạng thái thành false nếu coupon đã hết hạn
      }

      // Đảm bảo rằng các trường không thay đổi sẽ giữ lại giá trị cũ
      const currentCoupon = this.subCouponForm.getRawValue(); // Lấy tất cả giá trị hiện tại của form (bao gồm cả giá trị cũ)

      // Nếu trường nào không thay đổi, giữ lại giá trị cũ
      if (!this.subCouponForm.get('code')?.dirty) {
        updatedCoupon.code = currentCoupon.code; // Giữ giá trị cũ của mã
      }
      if (!this.subCouponForm.get('description')?.dirty) {
        updatedCoupon.description = currentCoupon.description; // Giữ giá trị cũ của mô tả
      }
      if (!this.subCouponForm.get('discountType')?.dirty) {
        updatedCoupon.discount_type = currentCoupon.discountType; // Giữ giá trị cũ của discountType
      }
      if (!this.subCouponForm.get('discountValue')?.dirty) {
        updatedCoupon.discount_value = currentCoupon.discountValue; // Giữ giá trị cũ của discountValue
      }
      if (!this.subCouponForm.get('minOrderValue')?.dirty) {
        updatedCoupon.min_order_value = currentCoupon.minOrderValue; // Giữ giá trị cũ của minOrderValue
      }
      if (!this.subCouponForm.get('startDate')?.dirty) {
        updatedCoupon.start_date = currentCoupon.startDate; // Giữ giá trị cũ của startDate
      }
      if (!this.subCouponForm.get('endDate')?.dirty) {
        updatedCoupon.end_date = currentCoupon.endDate; // Giữ giá trị cũ của endDate
      }
      if (!this.subCouponForm.get('usageLimit')?.dirty) {
        updatedCoupon.usage_limit = currentCoupon.usageLimit; // Giữ giá trị cũ của usageLimit
      }
      if (!this.subCouponForm.get('status')?.dirty) {
        updatedCoupon.status = currentCoupon.status; // Giữ giá trị cũ của status
      }

      // Gọi API cập nhật
      this.couponService.updateCouponById(this.couponId, updatedCoupon).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Cập nhật thành công',
            detail: 'Mã giảm giá đã được cập nhật'
          });
          this.router.navigateByUrl('/admin/coupon'); // Redirect to coupon list after update
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Cập nhật thất bại',
            detail: 'Có lỗi xảy ra khi cập nhật mã giảm giá'
          });
        }
      );
    }
  }

}
