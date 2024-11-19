import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly TOKEN_KEY = 'access_token';

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
            localStorage.removeItem('user_role');
            localStorage.removeItem('userInfo');
        }
    }


    setRole(role: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user_role', role);
        }
    }

    getRole(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('user_role');
        }
        return null;
    }
    setUserInfo(userInfo: any) {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }

    getUserInfo(): any {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    }


    // // Kiểm tra tính hợp lệ của tokene
    // isTokenValid(): boolean {
    //     const token = this.getToken();

    //     return !!token; // Trả về true nếu có token
    // }


}