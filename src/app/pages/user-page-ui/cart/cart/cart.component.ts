import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { ImageModule } from 'primeng/image';
import { AddressComponent } from "../../address/address/address.component";
import { ButtonModule } from 'primeng/button';
import { AddressListComponent } from "../../address/address-list/address-list.component";
import { AddressService } from '../../../../services/address/address.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../services/order/order.service';
import { MessageService } from 'primeng/api';
import { CartService } from '../../../../services/order/cart.service';
import { PaymentService } from '../../../../services/payment/payment.service';




@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, FormsModule,
    ImageModule, ReactiveFormsModule, ButtonModule, AddressListComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CartComponent {

  cartItems: any[] = []; // Array to store cart items
  selectedAddress: any | null = null;
  selectAll: boolean = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private messageService: MessageService,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.loadCart();
    this.calculateTotalPrice();
    this.loadAddress();
    this.calculateTotal();



  }

  onAddressSelected(address: any) {
    this.selectedAddress = address; // Cập nhật địa chỉ
    this.closeAddressDialog(); // Đóng dialog sau khi chọn
  }
  loadAddress() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.selectedAddress = navigation.extras.state['address'];
    }
  }


  loadCart() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      const userId = user.id;
      // Get cart items 
      this.cartService.getCart(userId).subscribe({
        next: (res: any) => {
          if (res && res.data) {
            this.cartItems = res.data.items;
            this.cartService.updateCartSubject(this.cartItems);
          }
        },
        error: (err) => {
          console.error('Lỗi:', err);
        }
      });
    }
  }

  removeItem(cartItemId: number, index: number) {
    this.cartService.deleteCartItem(cartItemId).subscribe({
      next: (response) => {
        console.log(response); // Log phản hồi từ server
        this.cartItems.splice(index, 1); // Xóa sản phẩm khỏi danh sách hiển thị
      },
      error: (error) => {
        console.error('Error deleting cart item:', error);
      },
    });
  }

  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }

  totalPrice: number = 0;
  // Hàm tính tổng tiền giỏ hàng với giá khuyến mãi nhân với số lượng
  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((acc, item) => {
      // Kiểm tra nếu có giá khuyến mãi, sử dụng giá khuyến mãi, nếu không dùng giá bán
      const price = item.product_detail_id.prices[0].promotionPrice || item.product_detail_id.prices[0].sellingPrice;

      // Tính tổng giá của từng sản phẩm (giá * số lượng)
      return acc + (price * item.quantity);
    }, 0);
  }
  //thành tiền
  calculateTotal() {
    this.totalPrice = this.cartItems
      .filter(item => item.selected) // Lọc các sản phẩm được chọn
      .reduce((sum, item) => {
        const price =
          item.product_detail_id.prices[0].promotionPrice ??
          item.product_detail_id.prices[0].sellingPrice;
        return sum + price * item.quantity; // Cộng tiền
      }, 0);
  }

  // Tính tổng số lượng sản phẩm đã chọn
  getTotalQuantity(): number {
    return this.cartItems
      .filter(item => item.selected) // Lọc các sản phẩm đã được chọn
      .reduce((total, item) => total + item.quantity, 0); // Cộng dồn số lượng của sản phẩm đã chọn
  }

  // Cập nhật số lượng sản phẩm
  updateQuantity(cartItemId: number, quantity: number): void {
    if (quantity > 0) {
      // Cập nhật số lượng ngay lập tức trong mảng cartItems
      const updatedItemIndex = this.cartItems.findIndex(item => item.id === cartItemId);
      if (updatedItemIndex !== -1) {
        this.cartItems[updatedItemIndex].quantity = quantity; // Cập nhật số lượng sản phẩm
      }

      // Gọi API để đồng bộ giỏ hàng với server
      this.cartService.updateQuantity(cartItemId, quantity).subscribe(
        (updatedCart) => {
          if (updatedCart && updatedCart.items) {
            // Đồng bộ với server và cập nhật lại giỏ hàng nếu cần
            this.cartItems = this.cartItems.map(item => {
              const updatedItem = updatedCart.items.find((updated: any) => updated.id === item.id);
              if (updatedItem) {
                item.quantity = updatedItem.quantity; // Cập nhật số lượng từ server
                item.selected = item.selected; // Giữ nguyên trạng thái đã chọn
              }
              return item;
            });

            this.calculateTotalPrice();  // Cập nhật lại tổng tiền khi giỏ hàng thay đổi
            this.cartService.updateCartSubject(updatedCart.items);  // Đồng bộ với cartService
          }
        },
        (error) => {
          console.error('Lỗi khi cập nhật số lượng:', error);
        }
      );
    } else {
      alert('Số lượng phải lớn hơn 0');
    }
  }


  // Tăng số lượng sản phẩm
  incrementQuantity(cartItemId: number, quantity: number): void {
    // this.loadCart();
    const newQuantity = quantity + 1;  // Tăng số lượng lên 1
    this.updateQuantity(cartItemId, newQuantity); // Gọi hàm cập nhật số lượng
    this.calculateTotal();

  }

  // Giảm số lượng sản phẩm
  decrementQuantity(cartItemId: number, quantity: number): void {
    // this.loadCart();
    const newQuantity = quantity > 1 ? quantity - 1 : 1; // Giảm số lượng, nhưng không cho phép nhỏ hơn 1
    this.updateQuantity(cartItemId, newQuantity); // Gọi hàm cập nhật số lượng
    this.calculateTotal();

  }
  // Cập nhật số lượng từ input (trường hợp thay đổi bằng tay)
  onManualQuantityChange(cartItemId: number, quantity: number): void {
    const newQuantity = quantity > 0 ? quantity : 1;  // Đảm bảo số lượng phải lớn hơn 0
    this.updateQuantity(cartItemId, newQuantity); // Gọi hàm cập nhật số lượng
    this.calculateTotal(); //cập nhật thành tiền

  }

  //chọn 1
  onProductSelect(item: any, event: any) {
    item.selected = event.target.checked;
    this.calculateTotal(); // Tính lại tổng tiền sau khi chọn/bỏ chọn
  }

  // Phương thức thay đổi trạng thái của tất cả các sản phẩm khi chọn "Chọn tất cả"
  toggleSelectAll() {
    this.cartItems.forEach(item => item.selected = this.selectAll);
    this.calculateTotal(); // Tính lại tổng tiền sau khi ch
  }



  displayAddressDialog: boolean = false; // Biến này điều khiển việc hiển thị dialog

  showAddressDialog() {
    this.displayAddressDialog = true; // Mở dialog khi click nút
  }

  closeAddressDialog() {
    this.displayAddressDialog = false; // Đóng dialog
  }

  note: string = ''; // Lưu ghi chú từ người dùng
  paymentMethod: string = 'COD';

  // đặt hàng
  // placeOrder() {
  //   if (!this.selectedAddress) {
  //     alert('Vui lòng chọn địa chỉ giao hàng!');
  //     return;
  //   }

  //   const selectedItems = this.cartItems
  //     .filter(item => item.selected)
  //     .map(item => item.id);

  //   if (selectedItems.length === 0) {
  //     alert('Vui lòng chọn sản phẩm để đặt hàng!');
  //     return;
  //   }

  //   const paymentMethod = (document.querySelector('input[name="payment"]:checked') as HTMLInputElement)?.value;
  //   if (!paymentMethod) {
  //     alert('Vui lòng chọn phương thức thanh toán!');
  //     return;
  //   }

  //   const note = (document.querySelector('input[placeholder="Ghi chú thêm"]') as HTMLInputElement)?.value || '';

  //   const orderData = {
  //     user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').id,
  //     address_id: this.selectedAddress.id,
  //     note: this.note,
  //     payment_method: this.paymentMethod,
  //     selected_items: selectedItems,
  //   };

  //   this.orderService.createOrder(orderData).subscribe({
  //     next: (response) => {
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Đặt hàng thành công'
  //       });
  //       this.router.navigate(['/home'], { state: { order: response } });
  //       this.loadCart();
  //     },
  //     error: (err) => {
  //       console.error('Lỗi khi đặt hàng:', err);
  //       alert('Đặt hàng thất bại, vui lòng thử lại.');
  //     },
  //   });
  // }

  // placeOrder() {
  //   if (!this.selectedAddress) {
  //     alert('Vui lòng chọn địa chỉ giao hàng!');
  //     return;
  //   }

  //   const selectedItems = this.cartItems
  //     .filter(item => item.selected)
  //     .map(item => item.id);

  //   if (selectedItems.length === 0) {
  //     alert('Vui lòng chọn sản phẩm để đặt hàng!');
  //     return;
  //   }

  //   const paymentMethod = (document.querySelector('input[name="payment"]:checked') as HTMLInputElement)?.value;
  //   if (!paymentMethod) {
  //     alert('Vui lòng chọn phương thức thanh toán!');
  //     return;
  //   }

  //   const note = (document.querySelector('input[placeholder="Ghi chú thêm"]') as HTMLInputElement)?.value || '';

  //   // Tính tổng tiền từ giỏ hàng
  //   this.calculateTotal(); // Gọi hàm tính tổng tiền

  //   const orderData = {
  //     user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').id,
  //     address_id: this.selectedAddress.id,
  //     note: this.note,
  //     payment_method: this.paymentMethod,
  //     selected_items: selectedItems,
  //   };

  //   // Nếu phương thức thanh toán là "ONLINE_PAYMENT"
  //   if (paymentMethod === 'ONLINE_PAYMENT') {
  //     const totalAmount = this.totalPrice; // Dùng tổng tiền đã tính được làm amount thanh toán
  //     const bankCode = 'NCB'; // Bạn có thể thay đổi mã ngân hàng nếu có lựa chọn từ người dùng

  //     // Gọi API để tạo yêu cầu thanh toán VNPay
  //     this.paymentService.getVNPay(totalAmount, bankCode).subscribe({
  //       next: (response) => {
  //         if (response.code === 200 && response.data.code === 'ok') {
  //           // Chuyển hướng người dùng đến URL thanh toán của VNPay
  //           const paymentUrl = response.data.paymentUrl;
  //           window.location.href = paymentUrl; // Điều hướng đến URL thanh toán VNPay
  //         } else {
  //           alert('Lỗi khi tạo thanh toán trực tuyến, vui lòng thử lại.');
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Lỗi khi tạo VNPay thanh toán:', err);
  //         alert('Lỗi khi tạo thanh toán trực tuyến, vui lòng thử lại.');
  //       },
  //     });

  //     return; // Dừng việc tạo đơn hàng nếu là thanh toán online
  //   }

  //   // Nếu là thanh toán khi nhận hàng (COD), tiến hành tạo đơn hàng bình thường
  //   this.orderService.createOrder(orderData).subscribe({
  //     next: (response) => {
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Đặt hàng thành công'
  //       });
  //       this.router.navigate(['/home'], { state: { order: response } });
  //       this.loadCart();
  //     },
  //     error: (err) => {
  //       console.error('Lỗi khi đặt hàng:', err);
  //       alert('Đặt hàng thất bại, vui lòng thử lại.');
  //     },
  //   });
  // }


  // placeOrder() {
  //   if (!this.selectedAddress) {
  //     alert('Vui lòng chọn địa chỉ giao hàng!');
  //     return;
  //   }

  //   const selectedItems = this.cartItems
  //     .filter(item => item.selected)
  //     .map(item => item.id);

  //   if (selectedItems.length === 0) {
  //     alert('Vui lòng chọn sản phẩm để đặt hàng!');
  //     return;
  //   }

  //   const paymentMethod = (document.querySelector('input[name="payment"]:checked') as HTMLInputElement)?.value;
  //   if (!paymentMethod) {
  //     alert('Vui lòng chọn phương thức thanh toán!');
  //     return;
  //   }

  //   const note = (document.querySelector('input[placeholder="Ghi chú thêm"]') as HTMLInputElement)?.value || '';

  //   // Tính tổng tiền từ giỏ hàng
  //   this.calculateTotal(); // Gọi hàm tính tổng tiền

  //   const orderData = {
  //     user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').id,
  //     address_id: this.selectedAddress.id,
  //     note: this.note,
  //     payment_method: this.paymentMethod,
  //     selected_items: selectedItems,
  //   };

  //   // Nếu phương thức thanh toán là "ONLINE_PAYMENT"
  //   if (paymentMethod === 'ONLINE_PAYMENT') {
  //     const totalAmount = this.totalPrice; // Dùng tổng tiền đã tính được làm amount thanh toán
  //     const bankCode = 'NCB'; // Bạn có thể thay đổi mã ngân hàng nếu có lựa chọn từ người dùng

  //     // Gọi API để tạo yêu cầu thanh toán VNPay
  //     this.paymentService.getVNPay(totalAmount, bankCode).subscribe({
  //       next: (response) => {
  //         if (response.code === 200 && response.data.code === 'ok') {
  //           // Chuyển hướng người dùng đến URL thanh toán của VNPay
  //           const paymentUrl = response.data.paymentUrl;
  //           window.location.href = paymentUrl; // Điều hướng đến URL thanh toán VNPay
  //         } else {
  //           alert('Lỗi khi tạo thanh toán trực tuyến, vui lòng thử lại.');
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Lỗi khi tạo VNPay thanh toán:', err);
  //         alert('Lỗi khi tạo thanh toán trực tuyến, vui lòng thử lại.');
  //       },
  //     });

  //     return; // Dừng việc tạo đơn hàng nếu là thanh toán online
  //   }

  //   // Nếu là thanh toán khi nhận hàng (COD), tiến hành tạo đơn hàng bình thường
  //   this.orderService.createOrder(orderData).subscribe({
  //     next: (response) => {
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Đặt hàng thành công'
  //       });
  //       this.router.navigate(['/home'], { state: { order: response } });
  //       this.loadCart();
  //     },
  //     error: (err) => {
  //       console.error('Lỗi khi đặt hàng:', err);
  //       alert('Đặt hàng thất bại, vui lòng thử lại.');
  //     },
  //   });
  // }

  // placeOrder() {
  //   if (!this.selectedAddress) {
  //     alert('Vui lòng chọn địa chỉ giao hàng!');
  //     return;
  //   }

  //   const selectedItems = this.cartItems
  //     .filter(item => item.selected)
  //     .map(item => item.id);

  //   if (selectedItems.length === 0) {
  //     alert('Vui lòng chọn sản phẩm để đặt hàng!');
  //     return;
  //   }

  //   const paymentMethod = (document.querySelector('input[name="payment"]:checked') as HTMLInputElement)?.value;
  //   if (!paymentMethod) {
  //     alert('Vui lòng chọn phương thức thanh toán!');
  //     return;
  //   }

  //   const note = (document.querySelector('input[placeholder="Ghi chú thêm"]') as HTMLInputElement)?.value || '';

  //   // Tính tổng tiền từ giỏ hàng
  //   this.calculateTotal(); // Gọi hàm tính tổng tiền

  //   const orderData = {
  //     user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').id,
  //     address_id: this.selectedAddress.id,
  //     note: this.note,
  //     payment_method: this.paymentMethod,
  //     selected_items: selectedItems,
  //   };

  //   // Nếu phương thức thanh toán là "ONLINE_PAYMENT"
  //   if (paymentMethod === 'ONLINE_PAYMENT') {
  //     const totalAmount = this.totalPrice; // Dùng tổng tiền đã tính được làm amount thanh toán
  //     const bankCode = 'NCB'; // Bạn có thể thay đổi mã ngân hàng nếu có lựa chọn từ người dùng

  //     // Gọi API để tạo yêu cầu thanh toán VNPay
  //     this.paymentService.getVNPay(totalAmount, bankCode).subscribe({
  //       next: (response) => {
  //         if (response.code === 200 && response.data.code === 'ok') {
  //           // Chuyển hướng người dùng đến URL thanh toán của VNPay
  //           const paymentUrl = response.data.paymentUrl;
  //           window.location.href = paymentUrl; // Điều hướng đến URL thanh toán VNPay
  //         } else {
  //           alert('Lỗi khi tạo thanh toán trực tuyến, vui lòng thử lại.');
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Lỗi khi tạo VNPay thanh toán:', err);
  //         alert('Lỗi khi tạo thanh toán trực tuyến, vui lòng thử lại.');
  //       },
  //     });

  //     return; // Dừng việc tạo đơn hàng nếu là thanh toán online
  //   }

  //   // Nếu là thanh toán khi nhận hàng (COD), tiến hành tạo đơn hàng bình thường
  //   this.orderService.createOrder(orderData).subscribe({
  //     next: (response) => {
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Đặt hàng thành công'
  //       });
  //       this.router.navigate(['/home'], { state: { order: response } });
  //       this.loadCart();
  //     },
  //     error: (err) => {
  //       console.error('Lỗi khi đặt hàng:', err);
  //       alert('Đặt hàng thất bại, vui lòng thử lại.');
  //     },
  //   });
  // }

  // paymentCallback() {
  //   const urlParams = new URLSearchParams(window.location.search);

  //   const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');
  //   const vnp_TxnRef = urlParams.get('vnp_TxnRef'); // Mã đơn hàng (sử dụng mã này để tìm đơn hàng)
  //   const vnp_Amount = urlParams.get('vnp_Amount');
  //   const vnp_BankCode = urlParams.get('vnp_BankCode');
  //   const vnp_OrderInfo = urlParams.get('vnp_OrderInfo');

  //   // Kiểm tra mã phản hồi từ VNPay (00 = thành công)
  //   if (vnp_ResponseCode === '00') {
  //     // Thanh toán thành công, tiến hành tạo đơn hàng

  //     const orderData = {
  //       user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').id, // ID người dùng
  //       address_id: this.selectedAddress.id, // ID địa chỉ
  //       note: this.note, // Ghi chú
  //       payment_method: 'ONLINE_PAYMENT', // Phương thức thanh toán
  //       selected_items: this.cartItems.filter(item => item.selected).map(item => item.id), // Các sản phẩm đã chọn
  //     };

  //     // Gọi API để tạo đơn hàng sau khi thanh toán thành công
  //     this.orderService.createOrder(orderData).subscribe({
  //       next: (response) => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Thanh toán thành công',
  //           detail: 'Đơn hàng đã được thanh toán thành công qua VNPay.'
  //         });
  //         this.router.navigate(['/home']);
  //         this.loadCart();
  //       },
  //       error: (err) => {
  //         console.error('Lỗi khi tạo đơn hàng:', err);
  //         alert('Lỗi khi tạo đơn hàng, vui lòng thử lại.');
  //       },
  //     });
  //   } else {
  //     // Thanh toán không thành công
  //     alert('Thanh toán không thành công, vui lòng thử lại.');
  //   }
  // }



  // placeOrder() {
  //   if (!this.selectedAddress) {
  //     alert('Vui lòng chọn địa chỉ giao hàng!');
  //     return;
  //   }

  //   const selectedItems = this.cartItems
  //     .filter(item => item.selected)
  //     .map(item => item.id);

  //   if (selectedItems.length === 0) {
  //     alert('Vui lòng chọn sản phẩm để đặt hàng!');
  //     return;
  //   }

  //   if (!this.paymentMethod) {
  //     alert('Vui lòng chọn phương thức thanh toán!');
  //     return;
  //   }

  //   const note = (document.querySelector('input[placeholder="Ghi chú thêm"]') as HTMLInputElement)?.value || '';

  //   // Tính tổng tiền từ giỏ hàng
  //   this.calculateTotal(); // Gọi hàm tính tổng tiền

  //   const orderData = {
  //     user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').id,
  //     address_id: this.selectedAddress.id,
  //     note: this.note,
  //     payment_method: this.paymentMethod,
  //     selected_items: selectedItems,
  //     total_amount: this.totalPrice, // Thêm tổng tiền vào orderData
  //   };

  //   // Nếu phương thức thanh toán là "ONLINE_PAYMENT"
  //   if (this.paymentMethod === 'ONLINE_PAYMENT') {
  //     const bankCode = 'NCB'; // Bạn có thể thay đổi mã ngân hàng nếu có lựa chọn từ người dùng

  //     // Gọi API để tạo yêu cầu thanh toán VNPay
  //     this.paymentService.getVNPay(this.totalPrice, bankCode).subscribe({
  //       next: (response) => {
  //         if (response.code === 200 && response.data.code === 'ok') {
  //           // Cập nhật lại orderData với thông tin thanh toán VNPay
  //           // orderData.payment_url = response.data.paymentUrl;

  //           // Gọi API tạo đơn hàng, gửi dữ liệu thanh toán cùng
  //           this.orderService.createOrder(orderData).subscribe({
  //             next: (orderResponse) => {
  //               // Điều hướng đến trang thanh toán VNPay
  //               window.location.href = response.data.paymentUrl;
  //             },
  //             error: (err) => {
  //               console.error('Lỗi khi tạo đơn hàng:', err);
  //               alert('Đặt hàng thất bại, vui lòng thử lại.');
  //             },
  //           });
  //         } else {
  //           alert('Lỗi khi tạo thanh toán trực tuyến, vui lòng thử lại.');
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Lỗi khi tạo VNPay thanh toán:', err);
  //         alert('Lỗi khi tạo thanh toán trực tuyến, vui lòng thử lại.');
  //       },
  //     });

  //     return; // Dừng việc tạo đơn hàng nếu là thanh toán online
  //   }

  //   // Nếu là thanh toán khi nhận hàng (COD), tiến hành tạo đơn hàng bình thường
  //   this.orderService.createOrder(orderData).subscribe({
  //     next: (response) => {
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Đặt hàng thành công'
  //       });
  //       this.router.navigate(['/home'], { state: { order: response } });
  //       this.loadCart();
  //     },
  //     error: (err) => {
  //       console.error('Lỗi khi đặt hàng:', err);
  //       alert('Đặt hàng thất bại, vui lòng thử lại.');
  //     },
  //   });
  // }

  placeOrder() {
    if (!this.selectedAddress) {
      alert('Vui lòng chọn địa chỉ giao hàng!');
      return;
    }

    const selectedItems = this.cartItems
      .filter(item => item.selected)
      .map(item => item.id);

    if (selectedItems.length === 0) {
      alert('Vui lòng chọn sản phẩm để đặt hàng!');
      return;
    }

    if (!this.paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }

    const note = (document.querySelector('input[placeholder="Ghi chú thêm"]') as HTMLInputElement)?.value || '';

    // Tính tổng tiền từ giỏ hàng
    this.calculateTotal(); // Gọi hàm tính tổng tiền

    const orderData: any = {
      user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').id,
      address_id: this.selectedAddress.id,
      note: this.note,
      payment_method: this.paymentMethod,
      selected_items: selectedItems,
      total_amount: this.totalPrice, // Thêm tổng tiền vào orderData
    };

    // Nếu phương thức thanh toán là "ONLINE_PAYMENT"
    if (this.paymentMethod === 'ONLINE_PAYMENT') {
      const bankCode = 'NCB'; // Bạn có thể thay đổi mã ngân hàng nếu có lựa chọn từ người dùng

      // Gọi API để tạo yêu cầu thanh toán VNPay
      this.paymentService.getVNPay(this.totalPrice, bankCode).subscribe({
        next: (response) => {
          if (response.code === 200 && response.data.code === 'ok') {
            // Cập nhật lại orderData với thông tin thanh toán VNPay
            orderData.payment_url = response.data.paymentUrl;

            // Gọi API tạo đơn hàng, gửi dữ liệu thanh toán cùng
            this.orderService.createOrder(orderData).subscribe({
              next: (orderResponse) => {
                // this.messageService.add({
                //   severity: 'success',
                //   summary: 'Success',
                //   detail: 'Đặt hàng thành công, vui lòng thanh toán!'
                // });
                // Điều hướng đến trang thanh toán VNPay
                window.location.href = response.data.paymentUrl;
              },
              error: (err) => {
                console.error('Lỗi khi tạo đơn hàng:', err);
                alert('Đặt hàng thất bại, vui lòng thử lại.');
              },
            });
          } else {
            alert('Lỗi khi tạo thanh toán trực tuyến, vui lòng thử lại.');
          }
        },
        error: (err) => {
          console.error('Lỗi khi tạo VNPay thanh toán:', err);
          alert('Lỗi khi tạo thanh toán trực tuyến, vui lòng thử lại.');
        },
      });

      return; // Dừng việc tạo đơn hàng nếu là thanh toán online
    }

    // Nếu là thanh toán khi nhận hàng (COD), tiến hành tạo đơn hàng bình thường
    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Đặt hàng thành công'
        });
        this.router.navigate(['/home'], { state: { order: response } });
        this.loadCart();
      },
      error: (err) => {
        console.error('Lỗi khi đặt hàng:', err);
        alert('Đặt hàng thất bại, vui lòng thử lại.');
      },
    });
  }

  // handleVNPayCallback() {
  //   if (window.location.pathname === '/vn-pay-callback') {
  //     this.paymentService.getVNPayCallback().subscribe({
  //       next: (callbackResponse) => {
  //         if (callbackResponse.code === '00') {
  //           // Payment was successful, navigate to home page
  //           this.router.navigate(['/home'], { state: { order: callbackResponse.data } });
  //         } else {
  //           // Payment failed, alert user and navigate to home
  //           alert('Thanh toán thất bại.');
  //           this.router.navigate(['/home']);
  //         }
  //       },
  //       error: (error) => {
  //         console.error('Error in VNPay callback:', error);
  //         alert('Có lỗi xảy ra, vui lòng thử lại.');
  //         this.router.navigate(['/home']);
  //       }
  //     });
  //   }
  // }




}
