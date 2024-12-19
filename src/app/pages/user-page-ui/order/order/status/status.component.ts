import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SideBarComponent } from "../../side-bar/side-bar.component";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../../../services/order/order.service';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { DeliveryStatusComponent } from "./delivery-status/delivery-status.component";

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [ButtonModule, SideBarComponent, RouterLink, CommonModule, DeliveryStatusComponent],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
  providers: [DatePipe]
})
export class StatusComponent implements OnInit {
  orderId: number | undefined;
  order: any;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private location: Location,
    private datePipe: DatePipe
  ) {

  }
  goBack(): void {
    this.location.back(); // Navigate back to the previous page
  }

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.orderId) {
      this.loadOrderStatus(this.orderId);
    }
  }

  loadOrderStatus(id: number) {
    this.orderService.getOrderById(id).subscribe(
      (res) => {
        this.order = res.data; // Gán dữ liệu đơn hàng
      },
      (error) => {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
      }
    );
  }

  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }

  formatDate(date: string | null): string {
    if (!date || date === 'null') {
      return 'Chưa có'; // Nếu không có thời gian, hiển thị 'Chưa có'
    }

    const dateObj = new Date(date.split(' ')[0].split('-').reverse().join('-') + 'T' + date.split(' ')[1] + ':00'); // Chuyển đổi chuỗi ngày giờ sang kiểu Date
    if (isNaN(dateObj.getTime())) {
      return 'Chưa có'; // Nếu thời gian không hợp lệ, hiển thị 'Chưa có'
    }

    // Định dạng ngày theo kiểu "Ngày Tháng Năm"
    const formattedDate = dateObj.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Định dạng giờ theo kiểu "Giờ:Phút"
    const formattedTime = dateObj.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Trả về chuỗi theo định dạng yêu cầu
    return `${formattedTime} ${formattedDate}`;
  }

  // formatDate(date: string | null): string {
  //   if (!date) return '';
  //   return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
  // }

}
