import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthLayoutComponent } from "../../../layouts/auth-layout/auth-layout.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { LoginDTO } from '../../../dtos/auth/login.dto';
import { TokenService } from '../../../services/auth/token.service';
import { LoginResponse } from '../../../response/user/login.response';
import { UserService } from '../../../services/user/user.service';
import { UserResponse } from '../../../response/user/user.response';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthLayoutComponent, FormsModule, InputTextModule, FloatLabelModule,
    PasswordModule, ButtonModule, CheckboxModule, CommonModule, ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // lưu trạng thái login, ! khởi tạo sau phương thức ngOnInit
  submit = false;
  userResponse?: UserResponse;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService,
    private messageService: MessageService,
    private userService: UserService
  ) { }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }
  get email() {
    return this.loginForm.get('email'); //lấy email tong loginForm để truy cập trường này
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.submit = true;
    if (this.loginForm.valid) {
      const loginData = new LoginDTO(this.loginForm.value);
      this.authService.onLogin(loginData).subscribe({
        next: (res: any) => {
          if (res.data && res.data.token) {
            this.tokenService.setToken(res.data.token); //lưu token
            // console.log('token', token)
            // this.userService.getUserInfo(token).subscribe({
            //   next: (res: any) => {
            //     this.userResponse = {
            //       ...res,
            //       date_of_birth: new Date(res.date_of_birth),
            //     };
            //     this.userService.saveUserInfoToLocalStorage(this.userResponse);
            //   },
            //   complete: () => {

            //   },
            //   error: (err: any) => {
            //     this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Đã xảy ra lỗi. Vui lòng thử lại.' + err.message });
            //   }
            // });

            const userInfo = res.data.user;
            this.tokenService.setUserInfo(userInfo);


            // Lưu vai trò người dùng (ADMIN/USER)
            const role = res.data.user.role.name;
            this.tokenService.setRole(role); // Lưu vai trò người dùng
            if (role === 'ADMIN') {
              this.router.navigateByUrl('/'); // Đường dẫn tới `MainLayoutComponent`
            } else if (role === 'USER') {
              this.router.navigateByUrl('/vn'); // Đường dẫn tới `UserLayoutComponent`
            }
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đăng nhập thành công' });
          } else {
            this.messageService.add({ severity: 'error', summary: "Thất bại", detail: "Đăng nhập thất bại. Kiểm tra email và mật khẩu" });
          }
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Đã xảy ra lỗi. Vui lòng thử lại.' + err.message });

        }
      })
    }
  }

  // onSubmit() {
  //   this.submit = true;
  //   if (this.loginForm.valid) {
  //     const loginData = new LoginDTO(this.loginForm.value);
  //     this.authService.onLogin(loginData).subscribe({
  //       next: (res: LoginResponse) => {
  //         const { token } = res;
  //         console.log('Received token:', token);

  //         this.tokenService.setToken(token); //lưu token

  //         // this.userService.getUserInfo(token).subscribe({
  //         //   next: (res: any) => {
  //         //     this.userResponse = {
  //         //       ...res,
  //         //       date_of_birth: new Date(res.date_of_birth),
  //         //     };
  //         //     this.userService.saveUserInfoToLocalStorage(this.userResponse);
  //         //   },
  //         //   complete: () => {

  //         //   },
  //         //   error: (err: any) => {
  //         //     this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Đã xảy ra lỗi. Vui lòng thử lại.' + err.message });
  //         //   }
  //         // });




  //         this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đăng nhập thành công' });
  //         this.router.navigateByUrl('/vn');

  //       },
  //       error: (err) => {
  //         this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Đã xảy ra lỗi. Vui lòng thử lại.' + err.message });

  //       }
  //     })
  //   }
  // }

}
