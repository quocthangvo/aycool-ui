import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductService } from '../../../../services/product/product.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MaterialService } from '../../../../services/attribute/material.service';
import { SubCategoryService } from '../../../../services/category/sub-category.service';
import { Material } from '../../../../models/attribute/material.model';
import { SubCategory } from '../../../../models/category/sub-category.model';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/editor';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [FileUploadModule, FormsModule, InputTextModule, DropdownModule,
    CommonModule, ReactiveFormsModule, EditorModule, ToastModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UpdateProductComponent implements OnInit {
  productForm: FormGroup;
  submit = false;

  selectedProduct: any;

  categorySubNodes: any[] = [];// chọn category
  materialNodes: any[] = [];
  selectedSubCategory: any;
  selectedMaterial: any;

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private router: Router,
    private materialService: MaterialService,
    private subCategoryService: SubCategoryService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.productForm = this.fb.group({
      name: [''],
      sku: [''],
      sub_category_id: [''],
      material_id: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadMaterialOptions();
    this.loadSubCategoryOptions();

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      const id = +productId;
      // Gọi API để lấy dữ liệu sản phẩm theo ID
      this.productService.getProductById(id).subscribe(
        (res: any) => {
          this.selectedProduct = res.data;

          // Điền dữ liệu vào form
          this.productForm.patchValue({
            name: this.selectedProduct.name,
            sku: this.selectedProduct.sku,
            description: this.selectedProduct.description,
            sub_category_id: this.selectedProduct.sub_category_id,
            material_id: this.selectedProduct.material_id,
            // Thêm các trường khác nếu cần
          });
        },
        (error) => {
          console.error('Lỗi không tìm thấy sản phẩm:', error);
        }
      );
    }
  }

  // updateProduct() {
  //   const productId = this.route.snapshot.paramMap.get('id');
  //   if (productId) {
  //     const id = +productId;
  //     const updateData = this.productForm.value; // Lấy dữ liệu từ form

  //     // Tạo FormData để gửi các trường thông tin và ảnh
  //     const formData = new FormData();

  //     // Thêm các trường thông tin sản phẩm vào FormData
  //     for (let key in updateData) {
  //       if (updateData.hasOwnProperty(key)) {
  //         formData.append(key, updateData[key]);
  //       }
  //     }

  //     // Thêm các tệp đã tải lên vào FormData
  //     for (let file of this.uploadedFiles) {
  //       formData.append('files', file, file.name); // Thêm tệp ảnh vào FormData
  //     }

  //     // Gọi API để tải ảnh lên trước
  //     this.productService.uploadImageProduct(id, formData).subscribe({
  //       next: (response) => {
  //         this.messageService.add({ severity: 'info', summary: 'Thành công', detail: 'Tệp đã được tải lên.' });

  //         // Sau khi tải ảnh thành công, gọi API cập nhật sản phẩm
  //         this.productService.updateProductById(id, updateData).subscribe({
  //           next: () => {
  //             this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật sản phẩm thành công!' });
  //             this.router.navigate(['/admin/product']); // Điều hướng về trang sản phẩm
  //           },
  //           error: (error) => {
  //             this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại! ' + error.error.message });
  //           }
  //         });
  //       },
  //       error: (error) => {
  //         this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Tải ảnh lên thất bại! ' + error.error.message });
  //       }
  //     });
  //   }
  // }

  updateProduct() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      const id = +productId;
      const updateData = this.productForm.value; // Lấy dữ liệu từ form

      // Tạo FormData để gửi các trường thông tin và ảnh (nếu có)
      const formData = new FormData();

      // Thêm các trường thông tin sản phẩm vào FormData
      for (let key in updateData) {
        if (updateData.hasOwnProperty(key)) {
          formData.append(key, updateData[key]);
        }
      }

      // Nếu có tệp đã tải lên, thêm vào FormData
      if (this.uploadedFiles.length > 0) {
        for (let file of this.uploadedFiles) {
          formData.append('files', file, file.name); // Thêm tệp ảnh vào FormData
        }

        // Gọi API để tải ảnh lên
        this.productService.uploadImageProduct(id, formData).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'info', summary: 'Thành công', detail: 'Tệp đã được tải lên.' });

            // Sau khi tải ảnh thành công, gọi API cập nhật sản phẩm
            this.updateProductInfo(id, updateData);
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Tải ảnh lên thất bại! ' + error.error.message });
          }
        });
      } else {
        // Nếu không có ảnh, chỉ gọi API cập nhật sản phẩm
        this.updateProductInfo(id, updateData);
      }
    }
  }

  // Phương thức cập nhật sản phẩm
  updateProductInfo(id: number, updateData: any) {
    this.productService.updateProductById(id, updateData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật sản phẩm thành công!' });
        this.router.navigate(['/admin/product']); // Điều hướng về trang sản phẩm
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại! ' + error.error.message });
      }
    });
  }


  cancelUpdate() {
    this.router.navigateByUrl('/admin/product')
  }

  loadSubCategoryOptions() {
    this.subCategoryService.getAllSubCategories().subscribe((res: any) => {
      // Ánh xạ dữ liệu trả về vào categoryNodes
      this.categorySubNodes = res.data.map((subCategory: SubCategory) => ({
        label: subCategory.name, // Tên danh mục
        value: subCategory.id,    // ID danh mục

      }));
    });
  }
  onSubCategorySelect(event: any) {
    const id = event.value; // Lấy ID từ item đã chọn
    this.subCategoryService.getSubCategoryById(id).subscribe((subCategory: SubCategory) => {
      this.selectedSubCategory = subCategory;
    })

  }

  loadMaterialOptions() {
    this.materialService.getAllMaterials().subscribe((res: any) => {
      // Ánh xạ dữ liệu trả về vào categoryNodes
      this.materialNodes = res.data.map((material: Material) => ({
        label: material.name, // Tên danh mục
        value: material.id    // ID danh mục
      }));
    });
  }
  onMaterialSelect(event: any) {
    const id = event.value; // Lấy ID từ item đã chọn

    this.materialService.getMaterialById(id).subscribe((material: Material) => {
      this.selectedMaterial = material;
    })
  }

  uploadedFiles: any[] = [];

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.messageService.add({ severity: 'info', summary: 'Thành công', detail: 'Tệp đã được tải lên.' });
    console.log('Các tệp đã tải lên:', this.uploadedFiles);
  }

  //xóa ảnh đã upload
  removeFile(file: any) {
    // Loại bỏ ảnh khỏi danh sách ảnh đã tải lên
    const index = this.uploadedFiles.indexOf(file);
    if (index !== -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }
}
