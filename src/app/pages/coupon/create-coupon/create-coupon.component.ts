import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CouponService } from '../../../services/coupon/coupon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-coupon',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule,
    CommonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './create-coupon.component.html',
  styleUrl: './create-coupon.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CreateCouponComponent implements OnInit {
  subCouponForm: FormGroup;
  submit = false;

  constructor(
    private messageService: MessageService,
    private couponService: CouponService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.subCouponForm = this.fb.group({
      code: ['', Validators.required],
      description: ['', Validators.required],
      discount_type: ['', Validators.required],
      discount_value: ['', [Validators.required, Validators.min(1)]],
      min_order_value: ['', [Validators.required, Validators.min(1)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      usage_limit: ['', [Validators.required, Validators.min(1)]]
    });
  }
  ngOnInit(): void {

  }


  createCoupon() {
    this.submit = true;
    if (this.subCouponForm.valid) {
      const formData = this.subCouponForm.value;

      this.couponService.createCoupon(formData).subscribe({
        next: (res: any) => {
          if (res.data) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Tạo mới thành công'
            });
            this.router.navigateByUrl('/admin/coupon'); // Điều hướng sau khi tạo thành công


          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Thất bại',
              detail: 'Tạo mới thất bại'
            });
          }
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: '' + err.error.message
          });
        }
      });
    }
  }
  cancel() {
    this.router.navigateByUrl('/admin/coupon');
  }
}
