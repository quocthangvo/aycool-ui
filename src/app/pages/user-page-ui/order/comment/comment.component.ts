import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../services/order/order.service';
import { ReviewService } from '../../../../services/review/review.service';
import { ReviewDTO } from '../../../../dtos/review/review.dto';
import { UserService } from '../../../../services/user/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [FormsModule, InputTextareaModule, ButtonModule, SideBarComponent, CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CommentComponent implements OnInit {
  orderId: number = 0;
  order: any;
  rating: number = 0;
  commentText: string = '';
  stars: number[] = [1, 2, 3, 4, 5];
  userId: number | null = null;
  productId: number | null = null;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private reviewService: ReviewService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Lấy 'orderId' từ tham số URL
    this.route.params.subscribe(params => {
      const orderIdParam = params['orderId'];  // Lấy 'orderId' từ URL parameters
      this.orderId = +orderIdParam;  // Dùng toán tử '+' để chuyển string thành số

      // Kiểm tra nếu orderId là NaN (không hợp lệ)
      if (isNaN(this.orderId)) {
        console.error('Invalid order ID:', orderIdParam);
        return;  // Dừng việc gọi API nếu orderId không hợp lệ
      }

      this.loadOrderDetails(this.orderId);  // Gọi API để lấy chi tiết đơn hàng
    });

    // Lấy userId từ localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      this.userId = user.id;  // Lưu userId vào thuộc tính userId của lớp
    }
  }

  // Quay lại trang trước
  goBack(): void {
    this.location.back();
  }

  // Tải chi tiết đơn hàng
  loadOrderDetails(orderId: number): void {
    this.orderService.getOrderById(orderId).subscribe(
      (res) => {
        if (res && res.data) {
          this.order = res.data;
          this.productId = this.order.order_details[0]?.product_id; // Lấy product_id của sản phẩm đầu tiên
          this.userId = this.order.user_id;
        }
      },
      (error) => {
        console.error('Error fetching order details:', error);
      }
    );
  }

  // Chọn sao khi người dùng click vào sao
  setRating(rating: number): void {
    this.rating = rating;
  }

  // Gửi đánh giá
  submitReview(): void {
    if (this.userId === null) {
      console.error('User ID is missing');
      return;
    }

    // Ensure product_id is not null before submitting
    if (this.productId === null) {
      console.error('Product ID is missing');
      return;
    }

    const reviewData = {
      rating: this.rating,
      comment: this.commentText,
      product_id: this.productId, // Sử dụng productId đã lấy từ order_details
      order_id: this.orderId,
      user_id: this.userId,
    };
    console.log('Review Data:', reviewData);

    this.reviewService.createReview(reviewData).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đánh giá thành công' });
        this.goBack();
      },
      (error) => {
        console.error('Error submitting review:', error);
      }
    );
  }
}
