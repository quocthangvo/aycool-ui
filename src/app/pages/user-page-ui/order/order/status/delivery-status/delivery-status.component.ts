import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-delivery-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delivery-status.component.html',
  styleUrl: './delivery-status.component.scss'
})
export class DeliveryStatusComponent implements OnInit {
  @Input() status: string = ''; // Current status (pending, processing, shipped, delivered, cancelled)
  @Input() timestamps: { [key: string]: string | null } = {}; // Timestamps for each status
  statusTimestamps: string[] = [];

  ngOnInit(): void {
    // Make sure timestamps are formatted or 'Chưa có' if null
    console.log(this.timestamps);
    this.statusTimestamps = [
      this.formatDate(this.timestamps['order_date']),    // Đơn hàng đã đặt
      this.formatDate(this.timestamps['processing_date']), // Đang xử lý
      this.formatDate(this.timestamps['shipping_date']),   // Đang giao hàng
      this.formatDate(this.timestamps['delivered_date']),  // Đã nhận hàng
      this.formatDate(this.timestamps['cancelled_date']),  // Đã hủy
    ];
  }

  formatDate(date: string | null): string {
    if (!date || date === 'null') {
      return 'Chưa có'; // If there is no time, show 'Chưa có'
    }

    // Split the date by space to separate date and time
    const [datePart] = date.split(' ');

    return datePart; // Return only the date part
  }



  getCurrentStatus(): number {
    if (this.status === 'CANCELLED') {
      return 5; // If cancelled, return 5, but only show color for 'pending' and 'cancelled'
    }

    switch (this.status) {
      case 'PENDING':
        return 1;
      case 'PROCESSING':
        return 2;
      case 'SHIPPED':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  }
}
