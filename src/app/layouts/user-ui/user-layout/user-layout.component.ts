import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { TokenService } from '../../../services/auth/token.service';

import { CommonModule } from '@angular/common';
import { UserFooterComponent } from "../user-footer/user-footer.component";
import { HomeComponent } from "../../../pages/user-page-ui/product/home/home.component";
import { UserHeaderComponent } from "../user-header/user-header.component";


@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [InputTextModule, FormsModule, ImageModule, RouterLink, CommonModule, UserFooterComponent, RouterModule, UserHeaderComponent, HomeComponent],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UserLayoutComponent {
  userFullName: string | null = null;
  dropdownOpen: boolean = false;

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {

  }

  ngOnInit() {
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
    this.router.navigateByUrl('/vn'); // Chuyển hướng về trang đăng nhập
  }
}
