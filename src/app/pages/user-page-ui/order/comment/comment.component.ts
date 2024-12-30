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
import { GroupedProduct, GroupedProductDetail } from '../../../../dtos/review/group-product.dto';
import { ProductDetail } from '../../../../models/product/product.model';

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
  comment: string = '';
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
          // this.productId = this.order.order_details[0]?.product_id; // Lấy product_id của sản phẩm đầu tiên
          // this.userId = this.order.user_id;
          this.groupOrderDetails();
          this.order.order_details = this.order.order_details.map((detail: any) => ({
            ...detail,
            rating: 0, // Default rating
            comment: '', // Default comment
          }));
        }
      },
      (error) => {
        console.error('Error fetching order details:', error);
      }
    );
  }



  // setRating(index: number, rating: number): void {
  //   if (this.order && this.order.order_details[index]) {
  //     this.order.order_details[index].rating = rating;
  //   }
  // }


  // submitReview(): void {
  //   if (!this.order || !this.order.order_details) {
  //     console.error('No order details available');
  //     return;
  //   }

  //   // Chuẩn bị payload kiểu gộp
  //   const reviewsPayload = new ReviewDTO({
  //     rating: this.order.order_details.map((detail: any) => detail.rating),
  //     comment: this.order.order_details.map((detail: any) => detail.comment),
  //     product_id: this.order.order_details.map((detail: any) => detail.product_id),
  //     order_id: this.orderId,
  //     user_id: this.userId,
  //   });

  //   console.log('Payload to send:', reviewsPayload);

  //   // Gửi payload qua API
  //   this.reviewService.createReview(reviewsPayload).subscribe(
  //     (response) => {
  //       this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đánh giá thành công' });
  //       this.goBack();
  //     },
  //     (error) => {
  //       console.error('Error submitting reviews:', error);
  //     }
  //   );
  // }




  // Chọn sao khi người dùng click vào sao
  // setRating(rating: number): void {
  //   this.rating = rating;
  // }

  // Gửi đánh giá
  // submitReview(): void {
  //   if (this.userId === null) {
  //     console.error('User ID is missing');
  //     return;
  //   }

  //   // Ensure product_id is not null before submitting
  //   if (this.productId === null) {
  //     console.error('Product ID is missing');
  //     return;
  //   }

  //   const reviewData = {
  //     rating: this.rating,
  //     comment: this.commentText,
  //     product_id: this.productId, // Sử dụng productId đã lấy từ order_details
  //     order_id: this.orderId,
  //     user_id: this.userId,
  //   };
  //   console.log('Review Data:', reviewData);

  //   this.reviewService.createReview(reviewData).subscribe(
  //     (response) => {
  //       this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đánh giá thành công' });
  //       this.goBack();
  //     },
  //     (error) => {
  //       console.error('Error submitting review:', error);
  //     }
  //   );
  // }
  // submitReview(): void {
  //   if (!this.order || !this.order.order_details) {
  //     console.error('No order details available');
  //     return;
  //   }

  //   const reviews = this.order.order_details.map((detail: any) => ({
  //     rating: detail.rating,
  //     comment: detail.comment,
  //     product_id: detail.product_id,
  //     order_id: this.orderId,
  //     user_id: this.userId,
  //   }));

  //   console.log('Reviews:', reviews);
  //   this.reviewService.createReview(reviews).subscribe(
  //     (response) => {
  //       this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đánh giá thành công' });
  //       this.goBack();
  //     },
  //     (error) => {
  //       console.error('Error submitting reviews:', error);
  //     }
  //   );
  // }

  groupedOrderDetails: any[] = [];

  groupOrderDetails(): void {
    // Group products by productId
    const grouped = this.order.order_details.reduce((acc: any, detail: any) => {
      if (!acc[detail.product_id]) {
        acc[detail.product_id] = [];
      }
      acc[detail.product_id].push(detail);
      return acc;
    }, {});

    // Convert the grouped object to an array
    this.groupedOrderDetails = Object.keys(grouped).map(key => ({
      productId: key,
      details: grouped[key]
    }));

    // Initialize rating and comment for each group
    this.groupedOrderDetails.forEach(group => {
      group.rating = 0; // Default rating for the group
      group.comment = ''; // Default comment for the group
    });
  }

  setRating(groupIndex: number, rating: number): void {
    if (this.groupedOrderDetails[groupIndex]) {
      this.groupedOrderDetails[groupIndex].rating = rating;
      // Update the rating for all products in this group
      this.groupedOrderDetails[groupIndex].details.forEach((detail: any) => {
        detail.rating = rating;
      });
    }
  }

  submitReview(): void {
    if (!this.order || !this.order.order_details) {
      console.error('No order details available');
      return;
    }

    // Prepare payload for review submission
    const reviewsPayload = new ReviewDTO({
      rating: this.groupedOrderDetails.map(group => group.rating),
      comment: this.groupedOrderDetails.map(group => group.comment),
      product_id: this.groupedOrderDetails.map(group => group.productId),
      order_id: this.orderId,
      user_id: this.userId,
    });

    console.log('Payload to send:', reviewsPayload);

    this.reviewService.createReview(reviewsPayload).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đánh giá thành công' });
        this.goBack();
      },
      (error) => {
        console.error('Error submitting reviews:', error);
      }
    );
  }
}
