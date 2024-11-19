import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TokenService } from '../../services/auth/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [AvatarModule, RouterOutlet, MenuModule, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MainLayoutComponent {
  items: MenuItem[] | undefined;
  selectedIndex: number | null = null;

  constructor(private router: Router, private tokenService: TokenService) { }

  ngOnInit() {
    this.items = [
      { label: 'Profile', icon: 'pi pi-user', command: () => this.goToProfile() },
      { label: 'Settings', icon: 'pi pi-cog', command: () => this.goToSettings() },
      { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
    ];

    // Khôi phục chỉ mục đã chọn từ localStorage nếu có
    // const savedIndex = localStorage.getItem('selectedIndex');
    // if (savedIndex !== null) {
    //   this.selectedIndex = parseInt(savedIndex, 10);
    // }


  }

  goToProfile() {
    console.log('Go to Profile');
  }

  goToSettings() {
    console.log('Go to Settings');
  }

  logout() {
    this.tokenService.removeToken();
    this.router.navigateByUrl('login')

  }
  onSelect(index: number, router: string) {
    this.selectedIndex = index;
    this.router.navigateByUrl(router);

    // localStorage.setItem('selectedIndex', index.toString()); // Lưu trạng thái vào localStorage
  }

  //dropdown
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  home() {
    this.onSelect(0, '');
  }
  userList() {
    this.onSelect(1, '/user');
  }
  subCategoryList() {
    this.onSelect(2, '/sub-category');
  }

  productList() {
    this.onSelect(3, '/product');
  }

  materialList() {
    this.onSelect(4, '/material');
  }

  colorList() {
    this.onSelect(5, '/color');
  }
  sizeList() {
    this.onSelect(6, '/size');
  }
  orderList() {
    this.onSelect(7, '/order');
  }

  priceList() {
    this.onSelect(8, 'price')
  }
}
