import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ReviewService } from '../../../../services/review/review.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [FormsModule, ButtonModule, ToastModule,
    CommonModule, DialogModule, ConfirmDialogModule, TableModule, ImageModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ReplyComponent implements OnChanges {
  @Input() display: boolean = false; // Hiển thị dialog
  @Input() productId: number | null = null; // ID sản phẩm
  @Output() close = new EventEmitter<void>(); // Phát sự kiện đóng dialog

  reviews: any[] = []; // Danh sách đánh giá
  totalPages: number = 0; // Tổng số trang
  page: number = 0; // Trang hiện tại
  limit: number = 10; // Số lượng đánh giá mỗi trang
  totalStars: number = 0;
  averageRating: number = 0;
  constructor(private reviewService: ReviewService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['display'] && this.display && this.productId) {
      this.loadReviews(); // Gọi khi dialog được hiển thị
    }
  }

  loadReviews(): void {
    if (!this.productId) return; // Ensure the productId is set

    this.reviewService.getAllReviews(this.productId, this.page, this.limit).subscribe(
      (res) => {
        this.reviews = res.data.reviewResponseList || []; // Populate the reviews array
        this.calculateTotalStars();
        this.calculateAverageRating();
      },
      (error) => {
        console.error('Error fetching reviews:', error); // Handle errors
      }
    );
  }
  // Tính tổng số sao
  calculateTotalStars(): void {
    this.totalStars = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  }
  // Tính điểm đánh giá trung bình
  calculateAverageRating(): void {
    if (this.reviews.length > 0) {
      this.averageRating = this.totalStars / this.reviews.length;
    } else {
      this.averageRating = 0; // Nếu không có đánh giá, điểm trung bình là 0
    }
  }

  // Hàm xử lý xóa đánh giá với xác nhận
  deleteReview(event: Event, reviewId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn xóa đánh giá này?',
      header: 'Xác nhận',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Hủy',
      acceptLabel: 'Xóa',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        // Call the delete service to remove the review
        this.reviewService.deleteReviewById(reviewId).subscribe(
          () => {
            // Update the reviews list after deletion
            this.reviews = this.reviews.filter(review => review.id !== reviewId);
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đánh giá đã được xóa thành công',
            });
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Xóa đánh giá thất bại',
            });
          }
        );
      },

    });
  }

  statusReview(event: Event, reviewId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn ẩn hoặc hiển thị đánh giá này?',
      header: 'Xác nhận',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Hủy',
      acceptLabel: 'Ẩn/Hiển Thị',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.reviewService.statusReview(reviewId).subscribe(
          (response) => {
            // Cập nhật lại danh sách đánh giá sau khi ẩn/hiển thị
            this.reviews = this.reviews.map(review =>
              review.id === reviewId ? { ...review, status: !review.status } : review
            );
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Trạng thái đánh giá đã được cập nhật',
            });
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể cập nhật trạng thái đánh giá',
            });
          }
        );
      },
    });
  }




  cancel(): void {
    this.close.emit(); // Đóng dialog
  }
}
