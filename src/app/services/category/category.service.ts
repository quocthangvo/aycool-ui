import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';
import { SubCategoryDTO } from '../../dtos/category/sub-category.dto';
import { CategoryDTO } from '../../dtos/category/category.dto';
import { Category } from '../../models/category/category.model';


@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = `${environment.apiBaseUrl}/categories`;

    constructor(private http: HttpClient, private tokenService: TokenService) { }

    private getAuthHeaders() {
        const token = this.tokenService.getToken(); // Lấy token từ AuthService
        return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    }

    createCategory(data: CategoryDTO) {
        return this.http.post(`${this.apiUrl}`, data, { headers: this.getAuthHeaders() })
    }
    getAllCategories(): Observable<Category> {
        return this.http.get<Category>(this.apiUrl);
    }
    getCategoryById(id: number): Observable<Category> {
        return this.http.get<Category>(`${this.apiUrl}/${id}`);
    }

    deleteCategoryById(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    updateCategoryById(id: number, userData: any) {
        return this.http.put(`${this.apiUrl}/update/${id}`, userData, { headers: this.getAuthHeaders() });
    }
}