import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CouponService } from '../../../services/coupon/coupon.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-coupon-list',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule, FormsModule, RouterLink],
  providers: [ConfirmationService],
  templateUrl: './coupon-list.component.html',
  styleUrl: './coupon-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CouponListComponent {
  couponList: any[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private couponService: CouponService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons() {
    this.couponService.getAllCoupons().subscribe((res: any) => {
      this.couponList = res.data;
    })
  }

  onDelete(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa mã giảm giá không?',
      header: 'Xác nhận',
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      accept: () => {
        this.couponService.deleteCouponById(id).subscribe(
          (res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa thành công'
            });
            this.loadCoupons(); // Reload Coupon
          },
          (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Xóa thất bại'
            });
          }
        );
      },
      reject: () => {
        this.loadCoupons();
      }
    });
  }


  updateModel(couponId: number): void {

    this.router.navigate([`/admin/update-coupon/${couponId}`]);
    console.log(couponId);
  }

  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }
}
