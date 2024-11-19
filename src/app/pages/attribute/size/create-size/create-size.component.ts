import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { SizeService } from '../../../../services/attribute/size.service';
import { SizeListComponent } from '../size-list/size-list.component';
import { Router } from '@angular/router';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-create-size',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, ToastModule,
    CommonModule, ReactiveFormsModule, DialogModule, InputTextareaModule],
  templateUrl: './create-size.component.html',
  styleUrl: './create-size.component.scss'
})
export class CreateSizeComponent {

  sizeNodes: any[] = [];// chọn category
  selectedSize: any; // Lưu trữ thông tin của Material đã chọn


  sizeForm: FormGroup;
  submit = false;
  @Input() display: boolean = false; // Nhận trạng thái hiển thị từ Parent
  @Output() close = new EventEmitter<void>(); // Phát sự kiện đóng


  constructor(
    private messageService: MessageService,
    private sizeService: SizeService,
    private router: Router,
    private fb: FormBuilder,
    private sizeList: SizeListComponent
  ) {
    this.sizeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]], // Required and at least 3 characters
      description: ['']
    });
  }

  ngOnInit() {

  }


  get name() {
    return this.sizeForm.get('name');
  } //đặt tên là name để k phải truyền phần sub,CategoryForm.get('name') vào từng phần để validator

  create() {
    this.submit = true;
    if (this.sizeForm.valid) {
      const formData = this.sizeForm.value;
      console.log("Creating  with data:", formData);
      this.sizeService.createSize(formData).subscribe({
        next: (res: any) => {
          if (res.data) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Tạo mới thành công'
            });
            this.router.navigateByUrl('/size'); // Điều hướng sau khi tạo thành công
            this.close.emit(); // Đóng dialog sau khi thành công
            this.sizeList.loadSizes()
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
    this.sizeForm.reset(); // Reset form nếu cần
  }

}

