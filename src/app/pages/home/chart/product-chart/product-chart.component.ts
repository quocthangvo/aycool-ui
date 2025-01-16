import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { OrderDetailService } from '../../../../services/order/order-detail.service';

@Component({
  selector: 'app-product-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './product-chart.component.html',
  styleUrls: ['./product-chart.component.scss']
})
export class ProductChartComponent {

  chart: Chart | null;

  constructor(private orderDetailService: OrderDetailService) {
    this.chart = null;  // Gán giá trị null cho chart trong constructor
  }

  ngOnInit() {
    this.createChart([], []);
    this.loadTopSellingProducts();
  }

  loadTopSellingProducts() {
    this.orderDetailService.getTopSellingProducts().subscribe(
      (res) => {
        const products = res.data as { product_name: string, quantity_sold: number }[];

        // Check if products array is not empty
        if (products.length === 0) {
          console.warn('No top-selling products available.');
          return;
        }

        // Lấy danh sách tên sản phẩm và tổng số lượng bán ra
        const labels = products.map(p => p.product_name);
        const data = products.map(p => p.quantity_sold);

        // Tạo dữ liệu cho biểu đồ
        this.createChart(labels, data);
      },
      (error) => {
        console.error('Failed to load top-selling products', error);
      }
    );
  }

  createChart(labels: string[], data: number[]) {
    const ctx = (document.getElementById('productChart') as HTMLCanvasElement).getContext('2d');

    if (ctx) {
      if (this.chart) {
        this.chart.destroy();  // Nếu chart đã tồn tại, destroy nó trước khi tạo mới
      }

      this.chart = new Chart(ctx, {
        type: 'bar',  // Biểu đồ cột
        data: {
          labels: labels,
          datasets: [{
            label: 'Top Sản phẩm bán chạy',
            data: data,
            backgroundColor: [
              'rgba(249, 115, 22, 0.2)',
              'rgba(6, 182, 212, 0.2)',
              'rgba(107, 114, 128, 0.2)',
              'rgba(139, 92, 246, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgb(249, 115, 22)',
              'rgb(6, 182, 212)',
              'rgb(107, 114, 128)',
              'rgb(139, 92, 246)',
              'rgb(255, 206, 86)',
            ],
            borderWidth: 1,
          }]
        },
        options: {
          scales: {
            x: {
              ticks: {
                color: 'rgba(0, 0, 0, 0.6)',
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: 'rgba(0, 0, 0, 0.6)',
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
          },
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: 'rgba(0, 0, 0, 0.7)',
              },
            },
          },
        }
      });
    }
  }
}
