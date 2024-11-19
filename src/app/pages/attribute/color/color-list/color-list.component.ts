import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ColorService } from '../../../../services/attribute/color.service';
import { CreateColorComponent } from "../create-color/create-color.component";

@Component({
  selector: 'app-color-list',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule, FormsModule,
    CreateColorComponent],
  providers: [ConfirmationService],
  templateUrl: './color-list.component.html',
  styleUrl: './color-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ColorListComponent {

  selectedColor: any = {}


  colorList: any[] = [];
  displayDialog: boolean = false;

  constructor(
    private colorService: ColorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadColors();
  }

  loadColors() {
    this.colorService.getAllColors().subscribe((res: any) => {
      this.colorList = res.data;
    })
  }


  onDelete(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa màu sắc này không?',
      header: 'Xác nhận',
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      accept: () => {
        this.colorService.deleteColorById(id).subscribe(
          (res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa thành công'
            });
            this.loadColors(); // Reload category
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
        this.loadColors();
      }
    });
  }


  displayUpdateDialog: boolean = false;

  onModelUpdate(color: any) {
    this.colorService.getColorById(color.id).subscribe((colorData: any) => {
      this.selectedColor = { ...colorData.data }; // Sao chép danh mục đã chọn để tránh các vấn đề ràng buộc trực tiếp
      this.displayUpdateDialog = true; // Show the update dialog
    })

  }

  save() {
    if (this.selectedColor && this.selectedColor.id) {
      const colorId = this.selectedColor.id; // id của chất liệu

      const updateData = {

        name: this.selectedColor.name,
      };
      console.log("Sending updateData:", updateData);
      this.colorService.updateColorById(colorId, updateData).subscribe((res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công!' });
        this.displayUpdateDialog = false; // đóng  dialog
        this.loadColors();
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
  openCreateColorDialog() {
    this.displayDialog = true;
  }
  // Xử lý sau khi hộp thoại đóng
  handleDialogClose() {
    this.displayDialog = false;
  }
}


