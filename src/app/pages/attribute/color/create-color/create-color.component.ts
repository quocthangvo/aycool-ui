import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ColorService } from '../../../../services/attribute/color.service';

import { ColorListComponent } from '../color-list/color-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-color',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule,
    CommonModule, ReactiveFormsModule, DialogModule, InputTextareaModule],
  templateUrl: './create-color.component.html',
  styleUrl: './create-color.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CreateColorComponent {


  selectedSize: any; // Lưu trữ thông tin của Material đã chọn


  colorForm: FormGroup;
  submit = false;
  @Input() display: boolean = false; // Nhận trạng thái hiển thị từ Parent
  @Output() close = new EventEmitter<void>(); // Phát sự kiện đóng


  constructor(
    private messageService: MessageService,
    private colorService: ColorService,
    private router: Router,
    private fb: FormBuilder,
    private colorList: ColorListComponent
  ) {
    this.colorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]], // Required and at least 3 characters
    });
  }

  ngOnInit() {

  }


  get name() {
    return this.colorForm.get('name');
  } //đặt tên là name để k phải truyền phần sub,CategoryForm.get('name') vào từng phần để validator

  create() {
    this.submit = true;
    if (this.colorForm.valid) {
      const formData = this.colorForm.value;
      console.log("Creating  with data:", formData);
      this.colorService.createColor(formData).subscribe({
        next: (res: any) => {
          if (res.data) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Tạo mới thành công'
            });
            this.router.navigateByUrl('/color'); // Điều hướng sau khi tạo thành công
            this.close.emit(); // Đóng dialog sau khi thành công
            this.colorList.loadColors()
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
    this.colorForm.reset(); // Reset form nếu cần
  }

}


