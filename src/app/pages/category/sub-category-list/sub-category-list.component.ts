import { Component, ViewEncapsulation } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SubCategoryService } from '../../../services/category/sub-category.service';
import { CreateSubCategoryComponent } from "../create-sub-category/create-sub-category.component";
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../models/category/category.model';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-sub-category-list',
  standalone: true,
  imports: [TableModule, CommonModule, ImageModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule, FileUploadModule, FormsModule,
    CreateSubCategoryComponent, DropdownModule],
  providers: [ConfirmationService],
  templateUrl: './sub-category-list.component.html',
  styleUrl: './sub-category-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SubCategoryListComponent {
  categoryNodes: any[] = [];// chọn category
  selectedSubCategory: any = {}


  categoryList: any[] = [];
  displayDialog: boolean = false;

  constructor(private subCategoryService: SubCategoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategorys();
    this.loadCategoryOptions();
  }

  loadCategorys() {
    this.subCategoryService.getAllSubCategories().subscribe((res: any) => {
      this.categoryList = res.data;
    })
  }

  loadCategoryOptions() {
    this.categoryService.getAllCategories().subscribe((res: any) => {
      this.categoryNodes = res.data.map((category: any) => ({
        id: category.id, // ID của danh mục cha
        category_name: category.name, // Tên danh mục cha
      }));
    });
  }


  onCategorySelect(event: any) {
    const selectedCategory = this.categoryNodes.find(node => node.id === event.value);

    if (selectedCategory) {
      this.selectedSubCategory.category_id = selectedCategory.id; // ID danh mục cha
      this.selectedSubCategory.category_name = selectedCategory.category_name; // Tên danh mục cha
    }
  }




  onDelete(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa danh mục không?',
      header: 'Xác nhận',
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      accept: () => {
        this.subCategoryService.deleteSubCategoryById(id).subscribe(
          (res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa thành công'
            });
            this.loadCategorys(); // Reload category
          },
          (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Xóa thất bại'
            });
          }
        );
      },
      reject: () => {
        this.loadCategorys();
      }
    });
  }


  displayUpdateDialog: boolean = false;

  onModelUpdate(category: any) {
    this.subCategoryService.getSubCategoryById(category.id).subscribe((categoryData: any) => {
      this.selectedSubCategory = { ...categoryData.data }; // Sao chép danh mục đã chọn để tránh các vấn đề ràng buộc trực tiếp
      this.displayUpdateDialog = true; // Show the update dialog
    })

  }

  saveCategory() {
    if (this.selectedSubCategory && this.selectedSubCategory.id) {
      const subCategoryId = this.selectedSubCategory.id; // id của danh mục ccon

      const updateData = {
        name: this.selectedSubCategory.name,
        category_id: this.selectedSubCategory.category_id,
      };
      console.log("Sending updateData:", updateData);
      this.subCategoryService.updateSubCategoryById(subCategoryId, updateData).subscribe((res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật danh mục thành công!' });
        this.displayUpdateDialog = false; // đóng  dialog
        this.loadCategorys();
        this.loadCategoryOptions();// load lại danh sách select
      },
        (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại!' + error.error.message });
        }
      )
    }
  }

  cancelUpdate() {
    this.displayUpdateDialog = false; // Close dialog
  }

  //create category dialog
  // Mở hộp thoại tạo danh mục
  openCreateCategoryDialog() {
    this.displayDialog = true;
  }
  // Xử lý sau khi hộp thoại đóng
  handleDialogClose() {
    this.displayDialog = false;
  }
}
