import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { OrderService } from '../../../../services/order/order.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReviewService } from '../../../../services/review/review.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [SideBarComponent, ButtonModule, InputTextModule, CommonModule, RouterLink, ConfirmDialogModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  providers: [ConfirmationService],
  encapsulation: ViewEncapsulation.None
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  selectedStatus: string = '';
  noOrdersMessage: string = '';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private reviewService: ReviewService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const status = params['status'] || '';  // Lấy giá trị 'status' từ URL query params, mặc định là ''
      this.selectedStatus = status; // Cập nhật giá trị 'status'
      this.fetchOrders(status);  // Fetch đơn hàng theo trạng thái
    });
  }

  fetchOrders(status: string): void {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      const userId = user.id;
      this.orderService.getOrderByUserId(userId, status).subscribe(
        (res) => {
          if (res && res.data) {
            this.orders = res.data;
            if (this.orders.length === 0) {
              this.noOrdersMessage = 'Không có đơn hàng nào'; // Set the message when no orders found
            } else {
              this.noOrdersMessage = ''; // Clear the message if orders are found

              //kt đánh giá
              this.checkIfReviewed(userId);
            }
          }
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
      );
    }
  }

  // Phương thức lọc đơn hàng theo trạng thái
  filterOrders(status: string): void {
    // Cập nhật URL với query param 'status' khi nhấp vào các trạng thái
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { status: status },  // Thêm status vào URL
      queryParamsHandling: 'merge' // Giữ lại các query params cũ nếu có
    });
  }

  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }

  // hasReviewed: boolean = false;

  checkIfReviewed(userId: number): void {
    this.orders.forEach(order => {
      this.reviewService.hasReviewed(order.id, userId).subscribe(reviewed => {
        order.hasReviewed = reviewed;  // Add `hasReviewed` flag to each order
        console.log(`Order ID: ${order.id}, Has Reviewed: ${order.hasReviewed}`);
      });
    });
  }

  // cancelOrder(orderId: number): void {
  //   if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
  //     this.orderService.updateOrderStatus(orderId, 'CANCELLED').subscribe(
  //       (response) => {
  //         alert('Đơn hàng đã được hủy thành công!');
  //         this.fetchOrders(this.selectedStatus); // Refresh orders after cancellation
  //       },
  //       (error) => {
  //         if (error.status === 401 || error.status === 403) {
  //           alert('Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập lại.');
  //           this.router.navigate(['/login']); // Redirect to login if unauthorized
  //         } else {
  //           alert('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.');
  //         }
  //         console.error('Error canceling order:', error);
  //       }
  //     );
  //   }
  // }

  cancelOrder(orderId: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn hủy đơn hàng này không?',
      header: 'Xác nhận',
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      accept: () => {
        this.orderService.updateOrderStatus(orderId, 'CANCELLED').subscribe(
          (res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Hủy thành công'
            });
            this.fetchOrders(this.selectedStatus);
          },
          (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Hủy thất bại'
            });
          }
        );
      },
      reject: () => {
        // this.loadProductDetails(id);
      }
    });
  }


}
