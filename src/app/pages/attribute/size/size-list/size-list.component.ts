import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SizeService } from '../../../../services/attribute/size.service';
import { CreateSizeComponent } from "../create-size/create-size.component";
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-size-list',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule, FormsModule,
    CreateSizeComponent, InputTextareaModule],
  providers: [ConfirmationService],
  templateUrl: './size-list.component.html',
  styleUrl: './size-list.component.scss',
  encapsulation: ViewEncapsulation.None

})
export class SizeListComponent {

  sizeNodes: any[] = [];// chọn 
  selectedSize: any = {}


  sizeList: any[] = [];
  displayDialog: boolean = false;

  constructor(
    private sizeService: SizeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadSizes();
  }

  loadSizes() {
    this.sizeService.getAllSizes().subscribe((res: any) => {
      this.sizeList = res.data;
    })
  }


  onDelete(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa kích thước này không?',
      header: 'Xác nhận',
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      accept: () => {
        this.sizeService.deleteSizeById(id).subscribe(
          (res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa thành công'
            });
            this.loadSizes(); // Reload category
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
        this.loadSizes();
      }
    });
  }


  displayUpdateDialog: boolean = false;

  onModelUpdate(size: any) {
    this.sizeService.getSizeById(size.id).subscribe((sizeData: any) => {
      this.selectedSize = { ...sizeData.data }; // Sao chép danh mục đã chọn để tránh các vấn đề ràng buộc trực tiếp
      this.displayUpdateDialog = true; // Show the update dialog
    })

  }

  save() {
    if (this.selectedSize && this.selectedSize.id) {
      const sizeId = this.selectedSize.id; // id của chất liệu

      const updateData = {

        name: this.selectedSize.name,
      };
      console.log("Sending updateData:", updateData);
      this.sizeService.updateSizeById(sizeId, updateData).subscribe((res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công!' });
        this.displayUpdateDialog = false; // đóng  dialog
        this.loadSizes();
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
  openCreateSizeDialog() {
    this.displayDialog = true;
  }
  // Xử lý sau khi hộp thoại đóng
  handleDialogClose() {
    this.displayDialog = false;
  }
}

