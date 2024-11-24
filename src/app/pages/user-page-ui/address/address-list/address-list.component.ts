import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { AddressService } from '../../../../services/address/address.service';
import { MessageService } from 'primeng/api';
import { AddressComponent } from "../address/address.component";

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [CommonModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule, FormsModule, AddressComponent],
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AddressListComponent {

  addressList: any[] = [];
  user_id: number | null = null;
  selectedAddress: any | null = null; // Lưu địa chỉ được chọn


  @Input() display: boolean = false; // Nhận trạng thái hiển thị từ Parent
  @Output() close = new EventEmitter<void>();


  constructor(
    private addressService: AddressService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.user();
    this.loadAddress();
  }

  user() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      this.user_id = user.id;
      console.log('User ID:', this.user_id);
    } else {
      console.error('User info not found in localStorage');
    }
  }


  loadAddress() {
    if (this.user_id !== null) {  // Check if user_id is valid
      this.addressService.getAllAddressByUserId(this.user_id).subscribe(
        (res: any) => {
          this.addressList = res.data;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Không thể tải địa chỉ.'
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Không tìm thấy userId trong localStorage.'
      });
    }
  }
  cancel() {
    this.close.emit();
  }

  displayAddressDialog: boolean = false; // Biến này điều khiển việc hiển thị dialog

  showAddressDialog() {
    this.displayAddressDialog = true; // Mở dialog khi click nút
  }

  closeAddressDialog() {
    this.displayAddressDialog = false; // Đóng dialog
  }



  @Output() addressSelected = new EventEmitter<any>();

  confirmAddress() {
    if (this.selectedAddress) {
      this.addressSelected.emit(this.selectedAddress); // Gửi địa chỉ đã chọn
      this.close.emit(); // Đóng dialog
    }
  }

}
