import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { OrderService } from '../../../services/order/order.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,
    DialogModule, InputTextModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {

  selectedOrder: any = {}


  orderList: any[] = [];
  displayDialog: boolean = false;

  constructor(
    private orderService: OrderService,

    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders(0, 10).subscribe((res: any) => {
      this.orderList = res.data.orderResponseList;
    })
  }


  // onDelete(id: number, event: Event) {
  //   this.confirmationService.confirm({
  //     target: event.target as EventTarget,
  //     message: 'Bạn có muốn xóa màu sắc này không?',
  //     header: 'Xác nhận',
  //     icon: 'pi pi-info-circle',
  //     acceptIcon: "none",
  //     rejectIcon: "none",
  //     acceptButtonStyleClass: "p-button-danger p-button-text",
  //     rejectButtonStyleClass: "p-button-text p-button-text",
  //     accept: () => {
  //       this.orderService.deleteOrderById(id).subscribe(
  //         (res: any) => {
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Thành công',
  //             detail: 'Xóa thành công'
  //           });
  //           this.loadOrders(); // Reload category
  //         },
  //         (error: any) => {
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Lỗi',
  //             detail: 'Xóa thất bại'
  //           });
  //         }
  //       );
  //     },
  //     reject: () => {
  //       this.loadOrders();
  //     }
  //   });
  // }


  // displayUpdateDialog: boolean = false;

  // onModelUpdate(color: any) {
  //   this.colorService.getColorById(color.id).subscribe((colorData: any) => {
  //     this.selectedColor = { ...colorData.data }; // Sao chép danh mục đã chọn để tránh các vấn đề ràng buộc trực tiếp
  //     this.displayUpdateDialog = true; // Show the update dialog
  //   })

  // }

  // save() {
  //   if (this.selectedColor && this.selectedColor.id) {
  //     const colorId = this.selectedColor.id; // id của chất liệu

  //     const updateData = {

  //       name: this.selectedColor.name,
  //     };
  //     console.log("Sending updateData:", updateData);
  //     this.colorService.updateColorById(colorId, updateData).subscribe((res: any) => {
  //       this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công!' });
  //       this.displayUpdateDialog = false; // đóng  dialog
  //       this.loadColors();
  //     },
  //       (error: any) => {
  //         this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật thất bại!' + error.error.message });
  //       }
  //     )
  //   }
  // }

  // cancelUpdate() {
  //   this.displayUpdateDialog = false; // Close dialog
  // }


}



