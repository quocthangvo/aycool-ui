
import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialService } from '../../../../services/attribute/material.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CreateMaterialComponent } from '../create-material/create-material.component';


@Component({
  selector: 'app-material-list',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule, FormsModule,
    CreateMaterialComponent],
  templateUrl: './material-list.component.html',
  styleUrl: './material-list.component.scss',
  providers: [ConfirmationService],
  encapsulation: ViewEncapsulation.None
})
export class MaterialListComponent {
  materialNodes: any[] = [];// chọn 
  selectedMaterial: any = {}


  materialList: any[] = [];
  displayDialog: boolean = false;

  constructor(
    private materialService: MaterialService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials() {
    this.materialService.getAllMaterials().subscribe((res: any) => {
      this.materialList = res.data;
    })
  }


  onDelete(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa chất liệu này không?',
      header: 'Xác nhận',
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      accept: () => {
        this.materialService.deleteMaterialById(id).subscribe(
          (res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa thành công'
            });
            this.loadMaterials(); // Reload category
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
        this.loadMaterials();
      }
    });
  }


  displayUpdateDialog: boolean = false;

  onModelUpdate(material: any) {
    this.materialService.getMaterialById(material.id).subscribe((materialData: any) => {
      this.selectedMaterial = { ...materialData.data }; // Sao chép danh mục đã chọn để tránh các vấn đề ràng buộc trực tiếp
      this.displayUpdateDialog = true; // Show the update dialog
    })

  }

  saveMaterial() {
    if (this.selectedMaterial && this.selectedMaterial.id) {
      const materialId = this.selectedMaterial.id; // id của chất liệu

      const updateData = {

        name: this.selectedMaterial.name,
      };
      console.log("Sending updateData:", updateData);
      this.materialService.updateMaterialById(materialId, updateData).subscribe((res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công!' });
        this.displayUpdateDialog = false; // đóng  dialog
        this.loadMaterials();
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
  openCreateMaterialDialog() {
    this.displayDialog = true;
  }
  // Xử lý sau khi hộp thoại đóng
  handleDialogClose() {
    this.displayDialog = false;
  }
}
