import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { UserFooterComponent } from '../user-footer/user-footer.component';
import { HomeComponent } from '../../../pages/user-page-ui/product/home/home.component';
import { TokenService } from '../../../services/auth/token.service';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [InputTextModule, FormsModule, ImageModule,
    RouterLink, CommonModule, UserFooterComponent, RouterModule, HomeComponent],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss'
})
export class UserHeaderComponent {
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
