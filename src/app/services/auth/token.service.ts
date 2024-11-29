import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly TOKEN_KEY = 'access_token';
    private readonly ROLE_KEY = 'user_role';
    private readonly USER_INFO_KEY = 'userInfo';

    // setToken(token: string) {
    //     localStorage.setItem((this.TOKEN_KEY), token);
    // }

    // getToken(): string | null {
    //     return localStorage.getItem(this.TOKEN_KEY);
    // }
    // removeToken(): void {
    //     return localStorage.removeItem(this.TOKEN_KEY);
    // }
    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    setToken(token: string) {

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.TOKEN_KEY, token); // Đảm bảo token là chuỗi
        }
    }


    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null; // Hoặc có thể trả về một giá trị mặc định nào đó
    }

    removeToken(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.ROLE_KEY);
            localStorage.removeItem(this.USER_INFO_KEY);
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

    // // Kiểm tra tính hợp lệ của tokene
    // isTokenValid(): boolean {
    //     const token = this.getToken();

    //     return !!token; // Trả về true nếu có token
    // }


}