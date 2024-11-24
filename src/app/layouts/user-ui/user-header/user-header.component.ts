import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';

import { TokenService } from '../../../services/auth/token.service';

import { UserService } from '../../../services/user/user.service';
import { CartService } from '../../../services/order/cart.service';


@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [InputTextModule, FormsModule, ImageModule,
    RouterLink, CommonModule, RouterModule],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss'
})
export class UserHeaderComponent {
  userFullName: string | null = null;
  dropdownOpen: boolean = false;

  cartItems: any[] = [];
  userId: number | null = null;


  constructor(
    private tokenService: TokenService,
    private router: Router,
    private cartService: CartService,
    private userSerivce: UserService
  ) {

  }

  ngOnInit() {
    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items; // Cập nhật giỏ hàng trên giao diện
    });

    this.loadCart();
    // Lấy thông tin người dùng từ localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      this.userFullName = user.full_name; // Lấy full_name từ thông tin người dùng
    }
  }



  toggleDropdown(event: Event): void {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();  // Ngừng sự kiện click propagating lên các phần tử cha
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    // Nếu click bên ngoài dropdown thì đóng dropdown
    const clickedInside = (event.target as HTMLElement).closest('.dropdown');
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }

  logout() {
    this.tokenService.removeToken();
    this.userFullName = null; // Xóa tên người dùng hiển thị
    this.cartService.clearCart();
    this.router.navigateByUrl('/vn/home'); // Chuyển hướng về trang đăng nhập
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

  loadCart() {
    const userInfo = localStorage.getItem('userInfo');

    // Check if userinfo exists in localStorage
    if (userInfo) {

      const user = JSON.parse(userInfo);
      const userId = user.id;

      // Call the getCart method passing the userId
      this.cartService.getCart(userId).subscribe({
        next: (res: any) => {
          if (res && res.data) {
            this.cartItems = res.data.items;
            this.cartService.updateCartSubject(this.cartItems);
          }
        },
        error: (err) => {
          if (err.status === 403) {
            console.error('Access Denied. You are not authorized to view this cart.');
          } else {
            console.error('An error occurred:', err);
          }
        }
      });

    }

  }
}
