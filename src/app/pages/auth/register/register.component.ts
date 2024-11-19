import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthLayoutComponent } from '../../../layouts/auth-layout/auth-layout.component';
import { AuthService } from '../../../services/auth/auth.service';

import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { RegisterDTO } from '../../../dtos/auth/register.dto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabelModule,
    PasswordModule, ButtonModule, CheckboxModule, CommonModule, ReactiveFormsModule, AuthLayoutComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  encapsulation: ViewEncapsulation.None

})
export class RegisterComponent {

  registerForm: FormGroup; // lưu trạng thái login, ! khởi tạo sau phương thức ngOnInit
  submit = false;

  constructor(
    private fB: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fB.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      retype_password: ['', [Validators.required]]

    })
  }

  get fullName() {
    return this.registerForm.get('full_name'); //lấy email trong registerForm để truy cập trường này
  }
  get email() {
    return this.registerForm.get('email'); //lấy email trong registerForm để truy cập trường này
  }
  get password() {
    return this.registerForm.get('password');
  }
  get retypePassword() {
    return this.registerForm.get('retype_password');
  }

  onSubmit() {
    this.submit = true; // Đặt submit là true khi gửi biểu mẫu
    // Kiểm tra tính hợp lệ của form
    if (this.registerForm.invalid) {
      return; // Không gửi yêu cầu nếu form không hợp lệ
    }
    const registerData = new RegisterDTO(this.registerForm.value);
    console.log('Register Data:', registerData);
    this.authService.onRegister(registerData).subscribe({
      next: (res: any) => {
        if (res.data) {
          // Hiển thị toast thông báo thành công
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đăng ký tài khoản thành công' });
          this.router.navigateByUrl("login")
        } else {
          // Hiển thị toast thông báo lỗi
          this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Đăng ký thất bại' });
        }
      },
      error: (err: any) => {
        // Hiển thị toast thông báo lỗi khi gặp sự cố trong quá trình gọi API
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: '' + err.error.message });
      }
    });
  }
}
