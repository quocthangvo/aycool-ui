import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MaterialService } from '../../../../services/attribute/material.service';
import { Router } from '@angular/router';
import { MaterialListComponent } from '../material-list/material-list.component';

@Component({
  selector: 'app-create-material',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, ToastModule,
    CommonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './create-material.component.html',
  styleUrl: './create-material.component.scss'
})
export class CreateMaterialComponent {
  materialNodes: any[] = [];// chọn category
  selectedMaterial: any; // Lưu trữ thông tin của Material đã chọn


  materialForm: FormGroup;
  submit = false;
  @Input() display: boolean = false; // Nhận trạng thái hiển thị từ Parent
  @Output() close = new EventEmitter<void>(); // Phát sự kiện đóng


  constructor(
    private messageService: MessageService,
    private materialService: MaterialService,
    private router: Router,
    private fb: FormBuilder,
    private materialList: MaterialListComponent
  ) {
    this.materialForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]], // Required and at least 3 characters

    });
  }

  ngOnInit() {

  }


  get name() {
    return this.materialForm.get('name');
  } //đặt tên là name để k phải truyền phần sub,CategoryForm.get('name') vào từng phần để validator

  createMaterial() {
    this.submit = true;
    if (this.materialForm.valid) {
      const formData = this.materialForm.value;
      console.log("Creating  with data:", formData);
      this.materialService.createMaterial(formData).subscribe({
        next: (res: any) => {
          if (res.data) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Tạo mới thành công'
            });
            this.router.navigateByUrl('/admin/material'); // Điều hướng sau khi tạo thành công
            this.close.emit(); // Đóng dialog sau khi thành công
            this.materialList.loadMaterials()
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
    this.close.emit(); // Phát sự kiện đóng dialog
    this.materialForm.reset(); // Reset form nếu cần
  }

}
