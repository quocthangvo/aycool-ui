import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { UserService } from '../../../services/user/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserDTO } from '../../../dtos/user/user.dto';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, CommonModule, ImageModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule, FileUploadModule, FormsModule, RouterLink],
  providers: [ConfirmationService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit {
  userList: any[] = [];

  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers(0, 10).subscribe((res: any) => {
      this.userList = res.data.userResponseList;
    })
  }
  getActiveStatus(active: string): string {
    return active === 'true' ? 'Đang hoạt động' : 'Vô hiệu hóa';
  }

  onDelete(userId: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa tài khoản này không?',
      header: 'Xác nhận',
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      accept: () => {
        this.userService.deleteUserById(userId).subscribe(
          (res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa thành công'
            });
            this.loadUsers(); // Reload User
          },
          (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: '' + error.error.message
            });
          }
        );
      },
      reject: () => {
        this.loadUsers();
      }
    });
  }

  onLock(userId: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn khóa tài khoản này không?',
      header: 'Xác nhận',
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      accept: () => {
        this.userService.lockUser(userId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Khóa thành công'
            });
            this.loadUsers(); // Reload User
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: error.error?.message || 'Đã xảy ra lỗi'
            });
          }
        });
      },
      reject: () => {
        this.loadUsers();
      }
    });
  }

  onUnLock(userId: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn mở khóa tài khoản này không?',
      header: 'Xác nhận',
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      accept: () => {
        this.userService.unlockUser(userId).subscribe(
          (res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Mở khóa thành công'
            });
            this.loadUsers(); // Reload User
          },
          (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: '' + error.error.message
            });
          }
        );
      },
      reject: () => {
        this.loadUsers();
      }
    });
  }

  selectedUser: any = {}

  displayUpdateDialog: boolean = false;

  onModelUpdate(user: any) {
    this.userService.getUserById(user.id).subscribe((userData: any) => {
      this.selectedUser = { ...userData.result }; // Clone the selected User to avoid direct binding issues
      this.displayUpdateDialog = true; // Show the update dialog
    })

  }


}
