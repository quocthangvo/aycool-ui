import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { SubCategoryService } from '../../../services/category/sub-category.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubCategoryListComponent } from '../sub-category-list/sub-category-list.component';

import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SubCategoryDTO } from '../../../dtos/category/sub-category.dto';
import { TreeSelectModule } from 'primeng/treeselect';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../models/category/category.model';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-create-sub-category',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, ToastModule,
    CommonModule, ReactiveFormsModule, DialogModule, DropdownModule],

  templateUrl: './create-sub-category.component.html',
  styleUrl: './create-sub-category.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CreateSubCategoryComponent {
  categoryNodes: any[] = [];// chọn category
  selectedCategory: any; // Lưu trữ thông tin của category đã chọn


  subCategoryForm: FormGroup;
  submit = false;
  @Input() display: boolean = false; // Nhận trạng thái hiển thị từ Parent
  @Output() close = new EventEmitter<void>(); // Phát sự kiện đóng


  constructor(
    private messageService: MessageService,
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private router: Router,
    private fb: FormBuilder,
    private categoryList: SubCategoryListComponent
  ) {
    this.subCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]], // Required and at least 3 characters
      category_id: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadCategoryOptions(); // Load TreeSelect options
  }


  loadCategoryOptions() {
    this.categoryService.getAllCategories().subscribe((res: any) => {
      // Ánh xạ dữ liệu trả về vào categoryNodes
      this.categoryNodes = res.data.map((category: Category) => ({
        label: category.name, // Tên danh mục
        value: category.id    // ID danh mục
      }));
      // console.log("Category Nodes:", this.categoryNodes);
    });
  }


  // onCategorySelect(event: any) {
  //   console.log("Sự kiện chọn danh mục:", event);
  //   const categoryId = event.value; // Lấy ID từ item đã chọn
  //   console.log("ID danh mục đã chọn:", categoryId); // Kiểm tra ID được lấy ra

  //   this.categoryService.getCategoryById(categoryId).subscribe((category: Category) => {
  //     this.selectedCategory = category
  //     console.log("Selected Category:", this.selectedCategory);
  //   })
  // }

  get name() {
    return this.subCategoryForm.get('name');
  } //đặt tên là name để k phải truyền phần sub,CategoryForm.get('name') vào từng phần để validator

  createCategory() {
    this.submit = true;
    if (this.subCategoryForm.valid) {
      const formData = this.subCategoryForm.value;
      console.log("Creating SubCategory with data:", formData);
      this.subCategoryService.createSubCategory(formData).subscribe({
        next: (res: any) => {
          if (res.data) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Tạo mới thành công'
            });
            this.router.navigateByUrl('/admin/sub-category'); // Điều hướng sau khi tạo thành công
            this.close.emit(); // Đóng dialog sau khi thành công
            this.categoryList.loadCategorys()
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
    this.subCategoryForm.reset(); // Reset form nếu cần
  }

}
