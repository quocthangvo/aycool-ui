
import { ChangeDetectorRef, Component, effect, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CategoryService } from '../../../../services/category/category.service';

@Component({
  selector: 'app-category-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './category-chart.component.html',
  styleUrls: ['./category-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryChartComponent {

  categories: any;
  data: any;

  options: any;

  platformId = PLATFORM_ID;

  constructor(private cd: ChangeDetectorRef,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.initChart();
    this.loadCategory();
  }

  loadCategory() {
    this.categoryService.getAllCategories().subscribe((res: any) => {
      this.categories = res.data;
    });
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [
            documentStyle.getPropertyValue('--p-cyan-500'),
            documentStyle.getPropertyValue('--p-orange-500'),
            documentStyle.getPropertyValue('--p-gray-500')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--p-cyan-400'),
            documentStyle.getPropertyValue('--p-orange-400'),
            documentStyle.getPropertyValue('--p-gray-400')
          ]
        }
      ]
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any) {
              return `${tooltipItem.label}: ${tooltipItem.raw}`;
            }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };

    this.cd.markForCheck();
  }
}
