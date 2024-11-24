import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Tạo kiểu dữ liệu cho các đối tượng tỉnh thành, quận huyện và phường xã
export interface Ward {
    Id: string;
    Name: string;
}

export interface District {
    Id: string;
    Name: string;
    Wards: Ward[];
}

export interface City {
    Id: string;
    Name: string;
    Districts: District[];
}

@Injectable({
    providedIn: 'root',
})
export class CityService {
    private apiUrl = 'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json';

    constructor(private http: HttpClient) { }

    // Phương thức để tải danh sách tỉnh thành
    getCities(): Observable<City[]> {
        return this.http.get<City[]>(this.apiUrl);
    }
}
