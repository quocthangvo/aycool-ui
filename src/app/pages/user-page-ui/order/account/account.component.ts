import { Component, OnInit } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SideBarComponent } from "../order/side-bar/side-bar.component";
import { UserService } from '../../../../services/user/user.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { UserInfoDTO } from '../../../../dtos/user/user-info.dto';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [InputTextModule, FileUploadModule, SideBarComponent, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  providers: [DatePipe]
})
export class AccountComponent implements OnInit {

  user: any = {};

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      const userId = user.id;

      this.userService.getUserById(userId).subscribe((res: any) => {
        this.user = res.data;
        // Chuyển đổi ngày tháng từ dd/MM/yyyy sang yyyy-MM-dd để hiển thị vào input[type="date"]
        this.user.date_of_birth = this.formatDateForApi(res.data.date_of_birth);
      });
    }
  }
  // Chuyển đổi ngày tháng từ dd/MM/yyyy sang yyyy-MM-dd trước khi gửi lên API
  formatDateForApi(date: string): string {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`; // Chuyển sang yyyy-MM-dd
  }

  updateUser(): void {
    const userId = this.user.id; // ID của người dùng từ đối tượng user
    const userData: Partial<UserInfoDTO> = {
      full_name: this.user.full_name,
      date_of_birth: this.user.date_of_birth,

    };

    this.userService.updateUserById(userId, userData).subscribe(
      (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công' });
        // Cập nhật lại thông tin người dùng trong localStorage
        const updatedUserInfo = {
          full_name: res.data.full_name,
          date_of_birth: res.data.date_of_birth
        };

        // Cập nhật thông tin vào service và localStorage
        this.userService.updateUser(updatedUserInfo);
        window.location.reload();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: '' + error.error.message });
      }
    );
  }

}
