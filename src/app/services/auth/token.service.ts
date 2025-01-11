import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly TOKEN_KEY = 'access_token';
    private readonly ROLE_KEY = 'user_role';
    private readonly USER_INFO_KEY = 'userInfo';
    private readonly EXPIRATION_KEY = 'token_expiration_time'; // Thêm khóa này để lưu thời gian hết hạn token

    // setToken(token: string) {
    //     localStorage.setItem((this.TOKEN_KEY), token);
    // }

    // getToken(): string | null {
    //     return localStorage.getItem(this.TOKEN_KEY);
    // }
    // removeToken(): void {
    //     return localStorage.removeItem(this.TOKEN_KEY);
    // }
    constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) { }

    // setToken(token: string) {

    //     if (isPlatformBrowser(this.platformId)) {
    //         localStorage.setItem(this.TOKEN_KEY, token); // Đảm bảo token là chuỗi
    //     }
    // }

    // getToken(): string | null {
    //     if (isPlatformBrowser(this.platformId)) {
    //         return localStorage.getItem(this.TOKEN_KEY);
    //     }
    //     return null; // Hoặc có thể trả về một giá trị mặc định nào đó
    // }

    setToken(token: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.TOKEN_KEY, token);

            // Lưu thời gian hết hạn (1 phút = 60000ms)
            const expirationTime = new Date().getTime() + (3 * 24 * 60 * 60 * 1000); // 3 ngày
            localStorage.setItem(this.EXPIRATION_KEY, expirationTime.toString());

            // Thiết lập setTimeout để tự động xóa token khi hết hạn
            setTimeout(() => {
                this.removeToken(); // Xóa token khi hết hạn
            }, 3 * 24 * 60 * 60 * 1000);
        }
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            const expirationTime = localStorage.getItem(this.EXPIRATION_KEY);
            if (expirationTime && new Date().getTime() > Number(expirationTime)) {
                this.removeToken(); // Nếu token hết hạn, tự động xóa token
                return null;
            }
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }


    removeToken(): void {
        if (isPlatformBrowser(this.platformId)) {
            const role = localStorage.getItem(this.ROLE_KEY); // Lấy vai trò người dùng từ localStorage

            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.ROLE_KEY);
            localStorage.removeItem(this.USER_INFO_KEY);
            localStorage.removeItem(this.EXPIRATION_KEY); // Xóa thời gian hết hạn
            // Điều hướng người dùng khi token bị xóa
            if (role === 'ADMIN') {
                this.router.navigateByUrl('/login'); // Nếu là Admin, điều hướng về trang đăng nhập
            } else if (role === 'USER') {
                this.router.navigateByUrl('/home'); // Nếu là User, điều hướng về trang chủ
            }
        }
    }


    setRole(role: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.ROLE_KEY, role);
        }
    }

    getRole(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.ROLE_KEY);
        }
        return null;
    }
    setUserInfo(userInfo: any) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
        }
    }

    getUserInfo(): any {
        if (isPlatformBrowser(this.platformId)) {
            const userInfo = localStorage.getItem(this.USER_INFO_KEY);
            return userInfo ? JSON.parse(userInfo) : null;
        }
        return null;
    }

    // Kiểm tra token hợp lệ (có thể mở rộng để kiểm tra tính hợp lệ của token, ví dụ JWT)
    isTokenValid(): boolean {
        const token = this.getToken();
        if (token) {
            // Kiểm tra tính hợp lệ của token (có thể kiểm tra theo thời gian hết hạn hoặc mã hóa)
            // Ví dụ: decode và kiểm tra thời gian hết hạn của token (JWT)
            return true; // Cần kiểm tra token thực tế ở đây
        }
        return false;
    }

    // isTokenValid(): boolean {
    //     const token = this.getToken();
    //     if (token) {
    //         try {
    //             // Giải mã token (nếu sử dụng JWT)
    //             const decodedToken = this.decodeToken(token);
    //             const currentTime = Math.floor(Date.now() / 1000);
    //             if (decodedToken.exp && decodedToken.exp > currentTime) {
    //                 return true; // Token hợp lệ
    //             }
    //         } catch (error) {
    //             console.error('Token không hợp lệ:', error);
    //         }
    //     }
    //     return false; // Token không hợp lệ hoặc không tồn tại
    // }

    // private decodeToken(token: string): any {
    //     const payload = token.split('.')[1];
    //     return JSON.parse(atob(payload));
    // }



}