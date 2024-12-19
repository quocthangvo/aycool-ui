import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environments";
import { Observable } from "rxjs";
import { Color } from "../../models/attribute/color.model";
import { ColorDTO } from "../../dtos/attribute/color.dto";
import { TokenService } from "../auth/token.service";



@Injectable({
    providedIn: 'root'
})
export class ColorService {
    private apiUrl = `${environment.apiBaseUrl}/colors`

    constructor(private http: HttpClient, private tokenService: TokenService) { }
    private getAuthHeaders() {
        const token = this.tokenService.getToken(); // Lấy token từ AuthService
        return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    }


    getAllColors() {
        return this.http.get(this.apiUrl)
    }
    getColorById(id: number): Observable<Color> {
        return this.http.get<Color>(`${this.apiUrl}/${id}`)
    }

    createColor(data: ColorDTO) {
        return this.http.post(`${this.apiUrl}`, data, { headers: this.getAuthHeaders() })
    }

    deleteColorById(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    updateColorById(id: number, userData: any) {
        return this.http.put(`${this.apiUrl}/update/${id}`, userData, { headers: this.getAuthHeaders() });
    }


}