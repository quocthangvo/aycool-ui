import { Component } from '@angular/core';
import { OrderService } from '../../../services/order/order.service';
import { CarouselModule } from 'primeng/carousel';
import { Router, RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { OrderDetailService } from '../../../services/order/order-detail.service';
import { ProductChartComponent } from "../chart/product-chart/product-chart.component";
import { OrderChartComponent } from "../chart/order-chart/order-chart.component";
import { OrderComponent } from "../../user-page-ui/order/order/order.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CarouselModule, ProductChartComponent, OrderChartComponent, OrderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  totalMoney: number = 0;
  totalOrders: number = 0;

  money: number = 0;
  paidOrder: number = 0;

  topProducts: any[] = [];
  responsiveOptions: any[] | undefined;
  constructor(
    private orderService: OrderService,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private orderDetailService: OrderDetailService
  ) { }

  ngOnInit(): void {
    this.loadTotalMoney();
    this.loadMoney();
    this.loadPaidOrder();
    this.topProduct();
  }

  loadTotalMoney() {
    this.orderService.getTotalMoneyOrder().subscribe(
      (res: any) => {
        this.totalMoney = res.data.totalMoney;
        this.totalOrders = res.data.totalOrders;
      },
    );
  }

  loadMoney() {
    this.orderService.getTotalMoneyByDate().subscribe((res: any) => {
      this.money = res.data;
    });
  }

  loadPaidOrder() {
    this.orderService.getTotalPaidOrderByDate().subscribe((res: any) => {
      this.paidOrder = res.data;
    });
  }
  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }




  topProduct() {
    this.orderDetailService.getTopSellingProducts().subscribe((res: any) => {

      const products = Array.isArray(res.data) ? res.data : [res.data];

      this.topProducts = products.map((product: any) => {
        return {
          ...product,
          imageUrl: product.image_url?.[0]?.imageUrl || '',  // Lấy URL ảnh đầu tiên, nếu không có thì trả về chuỗi rỗng
          price: product.price?.[0] || {}  // Lấy giá đầu tiên trong mảng price, nếu không có thì trả về đối tượng rỗng
        };
      });

    });
  }
}
