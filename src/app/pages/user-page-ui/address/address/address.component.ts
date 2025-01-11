import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { MessageService } from 'primeng/api';
import { AddressService } from '../../../../services/address/address.service';
import { City, CityService, District, Ward } from '../../../../services/address/city.service';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule,
    CommonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit {
  submit = false;
  addressForm: FormGroup;
  user_id: number | null = null;

  form: FormGroup;
  cities: City[] = []; // Danh sách thành phố
  districts: District[] = []; // Danh sách quận huyện
  wards: Ward[] = []; // Danh sách phường xã

  selectedCity: string = ''; // Tỉnh thành đã chọn
  selectedDistrict: string = ''; // Quận huyện đã chọn
  selectedWard: string = ''; // Phường xã đã chọn

  @Input() display: boolean = false; // Nhận trạng thái hiển thị từ Parent
  @Output() close = new EventEmitter<void>();

  constructor(
    private addressService: AddressService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private cityService: CityService

  ) {
    this.addressForm = this.fb.group({
      full_name: [''],
      phone_number: [''],
      street_name: [''],
      district: [''],
      ward: [''],
      city: [''],
    });
    this.form = this.fb.group({
      city: [''],
      district: [''],
      ward: ['']
    });
  }

  ngOnInit() {
    this.user();
    this.loadCities();

  }
  user() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      this.user_id = user.id;
      console.log('User ID:', this.user_id); // You can log the user ID for debugging
    } else {
      console.error('User info not found in localStorage');
    }
  }



  create() {
    this.submit = true;
    if (this.addressForm.valid) {
      const formData = this.addressForm.value;
      // Add the user_id to the form data

      // Tìm và gán tên thay vì mã cho city, district, ward
      const selectedCity = this.cities.find(city => city.Id === formData.city);
      const selectedDistrict = this.districts.find(district => district.Id === formData.district);
      const selectedWard = this.wards.find(ward => ward.Id === formData.ward);

      formData.city = selectedCity ? selectedCity.Name : '';
      formData.district = selectedDistrict ? selectedDistrict.Name : '';
      formData.ward = selectedWard ? selectedWard.Name : '';

      formData.user_id = this.user_id;

      console.log("Creating with data:", formData);

      this.addressService.createAddress(formData).subscribe({
        next: (res: any) => {
          if (res.data) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Tạo mới thành công'
            });
            this.close.emit(); // Đóng dialog sau khi thành công
            this.loadAddresses();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Thất bại',
              detail: 'Tạo mới thất bại'
            });
          }
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: '' + err.error.message
          });
        }
      });
    }
  }

  cancel() {
    this.display = false;
    this.close.emit(); // Emit sự kiện đóng form
    this.addressForm.reset(); // Reset form nếu cần
  }

  // Tải danh sách thành phố
  async loadCities() {
    this.cityService.getCities().subscribe(data => {
      console.log(data);
      this.cities = data;
    });
  }

  onCityChange(): void {
    const selectedCity = this.cities.find(city => city.Id === this.addressForm.value.city);
    if (selectedCity) {
      this.districts = selectedCity.Districts;
      this.addressForm.patchValue({ district: '', ward: '' });
    }
  }

  onDistrictChange(): void {
    const selectedDistrict = this.districts.find(district => district.Id === this.addressForm.value.district);
    if (selectedDistrict) {
      this.wards = selectedDistrict.Wards;
      this.addressForm.patchValue({ ward: '' });
    }
  }

  addresses: any[] = []; // Danh sách địa chỉ

  loadAddresses() {
    if (this.user_id !== null) {
      this.addressService.getAllAddressByUserId(this.user_id).subscribe({
        next: (res: any) => {
          this.addresses = res.data;
        },
        error: (err: any) => {
          console.error("Error loading addresses:", err);
        }
      });
    } else {
      console.error("User ID is null");
    }
  }

}
