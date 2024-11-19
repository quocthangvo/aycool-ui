import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { LoginDTO } from '../../dtos/auth/login.dto';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../../dtos/auth/register.dto';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiBaseUrl}/auths`;
    private apiConfig = {
        headers: this.createHeaders()
    }
    constructor(private http: HttpClient, private tokenService: TokenService) { }
    private createHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    onLogin(data: LoginDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, data, this.apiConfig)
    }
    onRegister(data: RegisterDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, data, this.apiConfig)
    }




    // // Kiểm tra tình trạng đăng nhập
    // isAuthenticated(): boolean {
    //     return this.tokenService.isTokenValid();
    // }


    // // Lưu token thông qua TokenService
    // saveToken(token: string): void {
    //     this.tokenService.setToken(token);
    // }
    // // Đăng xuất
    // logout(): void {
    //     this.tokenService.removeToken();
    // }



}
// Observable<any>: sử dụng để xử lý bất đồng bộ (asynchronous) và cho phép đăng ký (subscribe) để nhận kết quả từ yêu cầu HTTP.