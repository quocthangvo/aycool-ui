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
import { Router } from '@angular/router';
import { OrderService } from '../../../../services/order/order.service';
import { MessageService } from 'primeng/api';
import { CartService } from '../../../../services/order/cart.service';




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


  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private messageService: MessageService,
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
  // Tính tổng số lượng sản phẩm
  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }


  // Cập nhật số lượng sản phẩm
  // updateQuantity(cartItemId: number, quantity: number): void {
  //   if (quantity > 0) {
  //     this.cartService.updateQuantity(cartItemId, quantity).subscribe(
  //       (updatedCart) => {
  //         // Sau khi cập nhật số lượng, cập nhật lại giỏ hàng
  //         if (updatedCart && updatedCart.items) {
  //           // Tìm sản phẩm trong giỏ hàng và cập nhật số lượng trực tiếp
  //           const updatedItemIndex = this.cartItems.findIndex(item => item.id === cartItemId);
  //           if (updatedItemIndex !== -1) {
  //             this.cartItems[updatedItemIndex].quantity = quantity; // Cập nhật số lượng sản phẩm

  //             this.calculateTotalPrice();  // Cập nhật lại tổng tiền khi giỏ hàng thay đổi
  //           }

  //           // Cập nhật lại giỏ hàng (có thể tái đồng bộ với cartService nếu cần)
  //           this.cartService.updateCartSubject(updatedCart.items); // Cập nhật trạng thái giỏ hàng

  //         }
  //       },
  //       (error) => {
  //         console.error('Lỗi khi cập nhật số lượng:', error);
  //       }
  //     );
  //   } else {
  //     alert('Số lượng phải lớn hơn 0');
  //   }
  // }
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
  }

  // Giảm số lượng sản phẩm
  decrementQuantity(cartItemId: number, quantity: number): void {
    // this.loadCart();
    const newQuantity = quantity > 1 ? quantity - 1 : 1; // Giảm số lượng, nhưng không cho phép nhỏ hơn 1
    this.updateQuantity(cartItemId, newQuantity); // Gọi hàm cập nhật số lượng

  }

  // Cập nhật số lượng từ input (trường hợp thay đổi bằng tay)
  onManualQuantityChange(cartItemId: number, quantity: number): void {
    const newQuantity = quantity > 0 ? quantity : 1;  // Đảm bảo số lượng phải lớn hơn 0
    this.updateQuantity(cartItemId, newQuantity); // Gọi hàm cập nhật số lượng
  }

  onProductSelect(item: any, event: any) {
    item.selected = event.target.checked;
    this.calculateTotal(); // Tính lại tổng tiền sau khi chọn/bỏ chọn
  }

  // onProductSelect(item: any, event: Event) {
  //   item.selected = (event.target as HTMLInputElement).checked; // Cập nhật trạng thái chọn
  //   this.calculateTotal(); // Tính lại tổng tiền sau khi chọn/bỏ chọn
  // }

  displayAddressDialog: boolean = false; // Biến này điều khiển việc hiển thị dialog

  showAddressDialog() {
    this.displayAddressDialog = true; // Mở dialog khi click nút
  }

  closeAddressDialog() {
    this.displayAddressDialog = false; // Đóng dialog
  }

  note: string = ''; // Lưu ghi chú từ người dùng
  paymentMethod: string = 'COD';

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

    const paymentMethod = (document.querySelector('input[name="payment"]:checked') as HTMLInputElement)?.value;
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }

    const note = (document.querySelector('input[placeholder="Ghi chú thêm"]') as HTMLInputElement)?.value || '';

    const orderData = {
      user_id: JSON.parse(localStorage.getItem('userInfo') || '{}').id,
      address_id: this.selectedAddress.id,
      note: this.note,
      payment_method: this.paymentMethod,
      selected_items: selectedItems,
    };

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


}
