import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

import { InputTextModule } from 'primeng/inputtext';

import { ProductService } from '../../../../services/product/product.service';
import { ToastModule } from 'primeng/toast';

import { MaterialService } from '../../../../services/attribute/material.service';
import { Material } from '../../../../models/attribute/material.model';
import { SubCategoryService } from '../../../../services/category/sub-category.service';
import { SubCategory } from '../../../../models/category/sub-category.model';
import { EditorModule } from 'primeng/editor';
import { ProductDTO } from '../../../../dtos/product/product.dto';
import { FileUploadModule } from 'primeng/fileupload';
import { ColorService } from '../../../../services/attribute/color.service';
import { SizeService } from '../../../../services/attribute/size.service';
import { Color } from '../../../../models/attribute/color.model';
import { Size } from '../../../../models/attribute/size.model';
import { TreeSelectModule } from 'primeng/treeselect';


@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [FormsModule, InputTextModule, ButtonModule, ToastModule,
    CommonModule, ReactiveFormsModule, DialogModule, DropdownModule, EditorModule, FileUploadModule, TreeSelectModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
  encapsulation: ViewEncapsulation.None

})
export class CreateProductComponent implements OnInit {

  categorySubNodes: any[] = [];// chọn category
  materialNodes: any[] = [];
  colorNodes: any[] = [];
  sizeNodes: any[] = [];

  selectedSubCategoryName: any;
  // selectedMaterial: any;
  // selectedColor: number[] = [];
  // selectedSize: any;


  productForm: FormGroup;
  submit = false;


  constructor(
    private messageService: MessageService,
    private productService: ProductService,
    private subCategoryService: SubCategoryService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private materialService: MaterialService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      sku: ['', [Validators.required, Validators.minLength(2)]],
      sub_category_id: ['', [Validators.required]],
      material_id: ['', [Validators.required]],
      description: [''],
      colors: [[], [Validators.required]],
      sizes: [[], [Validators.required]]

    });
  }

  ngOnInit(): void {
    this.loadSubCategoryOptions();
    this.loadMaterialOptions();
    this.loadColorOptions();
    this.loadSizeOptions();
  }

  get name() {
    return this.productForm.get('name');
  }
  get sku() {
    return this.productForm.get('sku');
  }
  get description() {
    return this.productForm.get('description')
  }
  get subCategory() {
    return this.productForm.get('sub_category_id')
  }
  get material() {
    return this.productForm.get('material_id')
  }
  get colors() {
    return this.productForm.get('colors')
  }
  get sizes() {
    return this.productForm.get('sizes')
  }

  //danh mục
  loadSubCategoryOptions() {
    this.subCategoryService.getAllSubCategories().subscribe((res: any) => {
      // Ánh xạ dữ liệu trả về vào categoryNodes
      this.categorySubNodes = res.data.map((subCategory: SubCategory) => ({
        label: subCategory.name, // Tên danh mục
        value: subCategory.id,    // ID danh mục

      }));
    });
  }

  // chất liệu
  loadMaterialOptions() {
    this.materialService.getAllMaterials().subscribe((res: any) => {
      // Ánh xạ dữ liệu trả về vào categoryNodes
      this.materialNodes = res.data.map((material: Material) => ({
        label: material.name, // Tên danh mục
        value: material.id    // ID danh mục
      }));
    });
  }

  //color
  loadColorOptions() {
    this.colorService.getAllColors().subscribe((res: any) => {
      // Ánh xạ dữ liệu trả về vào colorNodes
      this.colorNodes = res.data.map((color: Color) => ({
        label: color.name,
        value: color.id,
      }));
    });
  }


  //size
  loadSizeOptions() {
    this.sizeService.getAllSizes().subscribe((res: any) => {
      // Ánh xạ dữ liệu trả về vào sizeNodes
      this.sizeNodes = res.data.map((size: Size) => ({
        label: size.name,
        value: size.id,
        description: size.description
      }));
    });
  }


  createProduct() {
    this.submit = true;
    if (this.productForm.valid) {
      const formData: ProductDTO = this.productForm.value;
      formData.colors = formData.colors.map((color: any) => color.value);
      formData.sizes = formData.sizes.map((size: any) => size.value);

      console.log("Create with data:", formData);

      this.productService.createProduct(formData).subscribe({
        next: (res: any) => {
          if (res.data && res.data.id) {
            const productId = res.data.id; // Lấy ID sản phẩm từ response
            console.log("ID sản phẩm:", productId);
            // Kiểm tra và gọi API upload ảnh nếu có ảnh
            if (this.uploadedFiles.length > 0) {
              const uploadData = new FormData();
              this.uploadedFiles.forEach((file: File) => {
                uploadData.append('files', file, file.name);
              });

              // Gọi API upload ảnh
              this.productService.uploadImageProduct(productId, uploadData).subscribe({
                next: (uploadRes: any) => {
                  console.log('Danh sách URL ảnh:', uploadRes.imageUrl);
                  this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Tạo sản phẩm và tải ảnh thành công' });
                  this.router.navigateByUrl("/product");
                },
                error: (err) => {
                  this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Tải ảnh lên thất bại: ' + err.message });
                }
              });
            } else {
              // Hiển thị toast thông báo thành công
              this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Tạo sản phẩm thành công' });
              this.router.navigateByUrl("/product");

            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Tạo sản phẩm thất bại' });
          }
        },
        error: (err: any) => {
          // Hiển thị toast thông báo lỗi khi gặp sự cố trong quá trình gọi API
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: '' + err.error.message });
        }
      });
    }
  }

  uploadedFiles: any[] = [];

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.messageService.add({ severity: 'info', summary: 'Thành công', detail: 'Tệp đã được tải lên.' });
    console.log('Các tệp đã tải lên:', this.uploadedFiles);
  }

  cancel() {
    this.router.navigateByUrl("/product"); // Chuyển hướng về danh sách 
  }

  //tự động điền danh mục vào ô tên
  onCategoryChange(event: any) {
    const selectedCategory = this.categorySubNodes.find(
      (category) => category.value === event.value
    );
    if (selectedCategory) {
      this.selectedSubCategoryName = selectedCategory.label; // Cập nhật tên danh mục vào biến selectedCategoryName
    }
  }


}


