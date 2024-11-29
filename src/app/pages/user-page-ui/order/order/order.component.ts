import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SideBarComponent } from "./side-bar/side-bar.component";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { OrderService } from '../../../../services/order/order.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [SideBarComponent, ButtonModule, InputTextModule, CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  selectedStatus: string = '';
  noOrdersMessage: string = '';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute
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
}
