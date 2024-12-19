import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ReviewService } from '../../../../services/review/review.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [DropdownModule, FormsModule, CommonModule, PaginatorModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ReviewComponent implements OnInit {

  @Input() reviews: any[] = [];
  @Input() productName: string = '';
  @Input() productDetails: any[] = [];
  @Input() productId: number | null = null;  // Add productId as input

  totalRecords: number = 0;
  rowsPerPage: number = 4; // Số đánh giá mỗi trang
  page: number = 0; // Trang hiện tại
  totalStars: number = 0; // Tổng số sao
  averageRating: number = 0; // Lưu trữ giá trị trung bình đánh giá

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService
  ) { }

  ngOnInit() {
    if (this.productId) {
      this.getReviews();
    }
  }

  getReviews(): void {
    if (!this.productId) return;

    this.reviewService.getReviewByProductId(this.page, this.rowsPerPage, this.productId).subscribe(
      (data) => {
        this.reviews = data.data.reviewResponseList;
        this.totalRecords = data.data.totalRecords;
        this.totalStars = data.data.totalStars;

        // Tính trung bình số sao
        this.averageRating = this.totalRecords > 0 ? this.totalStars / this.totalRecords : 0;
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  // Xử lý sự kiện phân trang
  onPageChange(event: any): void {
    this.page = event.first / this.rowsPerPage;
    this.getReviews();
  }
}