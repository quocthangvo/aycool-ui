import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';

import { TokenService } from '../../../services/auth/token.service';

import { UserService } from '../../../services/user/user.service';
import { CartService } from '../../../services/order/cart.service';
import { SubCategoryService } from '../../../services/category/sub-category.service';
import { CategoryService } from '../../../services/category/category.service';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [InputTextModule, FormsModule, ImageModule,
    RouterLink, CommonModule, RouterModule, ButtonModule],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UserHeaderComponent {
  userFullName: string | null = null;
  dropdownOpen: boolean = false;

  cartItems: any[] = [];
  userId: number | null = null;
  categories: any[] = [];


  constructor(
    private tokenService: TokenService,
    private router: Router,
    private cartService: CartService,
    private userSerivce: UserService,
    private categoryService: CategoryService,
  ) {

  }

  ngOnInit() {
    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items; // Cập nhật giỏ hàng trên giao diện
    });

    this.loadCart();
    this.loadCategories()
    // Lấy thông tin người dùng từ localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      this.userFullName = user.full_name; // Lấy full_name từ thông tin người dùng
    }
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe((res: any) => {
      this.categories = res.data;
    });
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
    this.router.navigateByUrl('/home'); // Chuyển hướng về trang đăng nhập
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

  onSubCategoryClick(subCategoryId: number) {
    this.router.navigate(['/product-filter', subCategoryId]); // Navigate with subcategoryId as a route parameter
    console.log('Subcategory ID:', subCategoryId);
  }

  searchTerm: string = '';
  onSearch() {
    if (this.searchTerm.trim()) {
      // If search term is not empty, navigate to the product-search page with the search query parameter
      this.router.navigate(['/product-search'], { queryParams: { search: this.searchTerm } });
    } else {
      // If search term is empty, navigate to the product-search page without query parameters
      this.router.navigate(['/product-search']);
    }
  }

}
