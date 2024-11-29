import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../../dtos/user/user.dto';
import { TokenService } from '../auth/token.service';
import { UserResponse } from '../../response/user/user.response';
import { UserInfoDTO } from '../../dtos/user/user-info.dto';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiBaseUrl}/users`;
    private userSubject = new BehaviorSubject<any>(null);

    private apiConfig = {
        headers: this.createHeaders()
    }
    constructor(private http: HttpClient, private tokenService: TokenService) { }
    private createHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    private getAuthHeaders() {
        const token = this.tokenService.getToken(); // Lấy token từ AuthService
        return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    }

    getAllUsers(page: number, limit: number): Observable<any> {
        const params = { page: page.toString(), limit: limit.toString() };
        const options = { headers: this.createHeaders(), params };

        return this.http.get(this.apiUrl, options);
    }

    getUserById(userId: string) {
        return this.http.get<UserDTO>(`${this.apiUrl}/${userId}`, this.apiConfig);
    }

    deleteUserById(userId: number) {
        return this.http.delete(`${this.apiUrl}/${userId}`, { headers: this.getAuthHeaders() });
    }

    lockUser(userId: number) {
        return this.http.put(`${this.apiUrl}/lock/${userId}`, {}, { headers: this.getAuthHeaders() });
    }

    unlockUser(userId: number) {
        return this.http.put(`${this.apiUrl}/unlock/${userId}`, {}, { headers: this.getAuthHeaders() });
    }

    updateUserById(userId: string, userData: Partial<UserInfoDTO>) {
        return this.http.put(`${this.apiUrl}/update/${userId}`, userData, { headers: this.getAuthHeaders() });
    }

    getUserInfo(token: string) {
        return this.http.post(`${this.apiUrl}/info`, {
            headers: new HttpHeaders({

                Authorization: `Bearer ${token}`
            })
        })
    }

    // saveUserInfoToLocalStorage(userResponse?: UserResponse) {
    //     try {
    //         if (userResponse == null || !userResponse) {
    //             return;
    //         }
    //         const userResponseJSON = JSON.stringify(userResponse);
    //         localStorage.setItem('user', userResponseJSON);
    //         console.log('user save', userResponseJSON);
    //     } catch (err) {
    //         console.log("Error", err)
    //     }
    // }
    // saveUserInfoFromLocalStorage() {
    //     try {

    //         const userResponseJSON = localStorage.getItem('user');
    //         if (userResponseJSON == null || userResponseJSON == undefined) {
    //             return null;
    //         }
    //         const userResponse = JSON.parse(userResponseJSON!);
    //         console.log('user from', userResponse);

    //         return userResponse;
    //     } catch (err) {
    //         console.log("Error", err)
    //     }
    // }

    // Cập nhật thông tin người dùng và đồng bộ vào localStorage
    updateUser(user: any): void {
        localStorage.setItem('userInfo', JSON.stringify(user));
        this.userSubject.next(user); // Cập nhật dữ liệu trong BehaviorSubject
    }
}