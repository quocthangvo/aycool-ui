import { Component } from '@angular/core';
import { OrderService } from '../../../services/order/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  totalMoney: number = 0;
  totalOrders: number = 0;

  money: number = 0;
  paidOrder: number = 0;

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadTotalMoney();
    this.loadMoney();
    this.loadPaidOrder();
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


}
