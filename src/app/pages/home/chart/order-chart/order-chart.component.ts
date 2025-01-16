import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../../services/order/order.service';

type TimeRange = 'week' | 'month' | 'quarter' | 'year';

@Component({
  selector: 'app-order-chart',
  templateUrl: './order-chart.component.html',
  styleUrls: ['./order-chart.component.scss'],
  standalone: true,
  imports: [ChartModule, DropdownModule, FormsModule, CommonModule],
  encapsulation: ViewEncapsulation.None
})
export class OrderChartComponent implements OnInit {
  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);

  // Các khoảng thời gian
  timeRanges = [
    { label: 'Tuần', value: 'week' },
    { label: 'Tháng', value: 'month' },
    { label: 'Quý', value: 'quarter' },
    { label: 'Năm', value: 'year' }
  ];
  selectedRange: TimeRange = 'week'; // Giá trị mặc định là 'week'

  constructor(
    private cd: ChangeDetectorRef,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.initChart();
    this.updateChart(); // Khởi tạo biểu đồ với dữ liệu từ API
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.options = {
        stacked: false,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: { color: textColor }
          }
        },
        scales: {
          x: {
            ticks: { color: textColorSecondary },
            grid: { color: surfaceBorder }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            ticks: { color: textColorSecondary },
            grid: { color: surfaceBorder }
          }
        }
      };
    }
  }

  updateChart() {
    const startDate = this.getStartDate(this.selectedRange);  // Lấy ngày bắt đầu dựa trên khoảng thời gian
    const endDate = new Date().toISOString();  // Ngày hiện tại

    this.orderService.getTotalRevenueByPeriod(this.selectedRange, startDate, endDate).subscribe({
      next: (response) => {
        const { labels, datasets } = response.data;

        this.data = {
          labels,
          datasets: [
            {
              label: `Doanh thu (${this.selectedRange})`,
              fill: false,
              borderColor: getComputedStyle(document.documentElement).getPropertyValue('--p-cyan-500'),
              tension: 0.4,
              data: datasets
            }
          ]
        };

        this.cd.markForCheck();  // Cập nhật biểu đồ
      },
      error: (err) => {
        console.error('Lỗi khi lấy dữ liệu doanh thu:', err);
      }
    });
  }


  onRangeChange(rangeValue: string) {
    this.selectedRange = rangeValue as TimeRange; // Chuyển đổi kiểu về TimeRange
    this.updateChart(); // Cập nhật biểu đồ
  }

  getStartDate(period: TimeRange): string {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const dayOfWeek = firstDayOfMonth.getDay();
        startDate = new Date(firstDayOfMonth.setDate(firstDayOfMonth.getDate() - dayOfWeek));
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);  // Bắt đầu năm từ ngày 01/01
        break;
      default:
        startDate = new Date(now.getFullYear(), 0, 1);  // Bắt đầu từ ngày 01/01 của năm hiện tại
    }

    // Kiểm tra và cắt giờ thành 00:00:00
    startDate.setHours(0, 0, 0, 0);

    return startDate.toISOString();
  }


  getEndDateOfYear(): string {
    const now = new Date();
    const year = now.getFullYear();
    const endOfYear = new Date(year, 11, 31);  // Đến ngày cuối cùng của tháng 12 năm hiện tại
    endOfYear.setHours(23, 59, 59, 999);  // Cắt giờ thành 23:59:59

    // Kiểm tra nếu năm nằm trong khoảng từ 2022 đến 2025
    if (year >= 2022 && year <= 2025) {
      return endOfYear.toISOString();
    }

    return new Date().toISOString();
  }






}
