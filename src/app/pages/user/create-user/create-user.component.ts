import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { RegisterDTO } from '../../../dtos/auth/register.dto';


@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, FileUploadModule, ToastModule, PasswordModule,
    CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CreateUserComponent {
  userForm: FormGroup;
  submit = false;


  constructor(private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      retype_password: ['', [Validators.required]]
    });
  }
  get fullName() {
    return this.userForm.get('full_name'); //lấy email trong registerForm để truy cập trường này
  }
  get email() {
    return this.userForm.get('email'); //lấy email trong registerForm để truy cập trường này
  }
  get password() {
    return this.userForm.get('password');
  }
  get retypePassword() {
    return this.userForm.get('retype_password');
  }
  createUser() {
    this.submit = true;
    if (this.userForm.invalid) {
      return; // Không gửi yêu cầu nếu form không hợp lệ
    }
    const registerData = new RegisterDTO(this.userForm.value);
    this.authService.onRegister(registerData).subscribe({
      next: (res: any) => {
        if (res.data) {
          // Hiển thị toast thông báo thành công
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Tạo tài khoản thành công' });
          this.router.navigateByUrl("/user")
        } else {
          // Hiển thị toast thông báo lỗi
          this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Tạo tài khoản thất bại' });
        }
      },
      error: (err: any) => {
        // Hiển thị toast thông báo lỗi khi gặp sự cố trong quá trình gọi API
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: '' + err.error.message });
      }
    });
  }
  cancel() {
    this.router.navigateByUrl("/user"); // Chuyển hướng về danh sách 
  }
}
