import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';
import { ReviewDTO } from '../../dtos/review/review.dto';



@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private apiUrl = `${environment.apiBaseUrl}/reviews`;

    private apiConfig = {
        headers: this.createHeaders()
    }
    private createHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    constructor(private http: HttpClient, private tokenService: TokenService) { }

    private getAuthHeaders() {
        const token = this.tokenService.getToken(); // Lấy token từ AuthService
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }


    createReview(data: ReviewDTO): Observable<ReviewDTO> {
        return this.http.post<ReviewDTO>(`${this.apiUrl}`, data, { headers: this.getAuthHeaders() })
    }

    getReviewByProductId(page: number, limit: number, productId: number): Observable<any> {
        const params = { page: page.toString(), limit: limit.toString() };
        const options = { headers: this.createHeaders(), params };

        return this.http.get(`${this.apiUrl}/product/${productId}`, options);
    }

    getReviewById(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    deleteReviewById(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    hasReviewed(orderId: number, userId: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/hasReviewed/${orderId}/${userId}`);
    }

}