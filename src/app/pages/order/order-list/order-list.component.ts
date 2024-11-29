import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { OrderService } from '../../../services/order/order.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { OrderDetailService } from '../../../services/order/order-detail.service';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,
    DialogModule, InputTextModule, FormsModule, DropdownModule, PaginatorModule, MultiSelectModule, CalendarModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class OrderListComponent implements OnInit {
  selectedOrder: any = {};
  orderList: any[] = [];
  selectedOrderDetails: any[] = []; // Chi tiết đơn hàng đã chọn
  totalMoney: number = 0;
  address_id: any = 0;
  status: any = '';

  totalRecords: number = 0; // Tổng số đơn hàng
  totalPages: number = 0; // Tổng số trang
  rowsPerPage: number = 10; // Số đơn hàng mỗi trang
  currentPage: number = 0; // Trang hiện tại



  statusOptions = [
    { label: 'Chờ xử lý', value: 'PENDING' },
    { label: 'Đang xử lý', value: 'PROCESSING' },
    { label: 'Đang giao hàng', value: 'SHIPPED' },
    { label: 'Đã giao hàng', value: 'DELIVERED' },
    { label: 'Đã huỷ', value: 'CANCELLED' }
  ];


  displayDialog: boolean = false;

  orderCode: any = '';
  orderDate: any = '';

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private orderDetailService: OrderDetailService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loadOrders(this.currentPage, this.rowsPerPage);
  }



  onPageChange(event: any): void {
    this.currentPage = event.page; // Cập nhật trang hiện tại
    this.rowsPerPage = event.rows; // Cập nhật số dòng mỗi trang
    this.loadOrders(this.currentPage, this.rowsPerPage);
  }

  // Thêm hàm lọc
  onFilter() {
    const formattedDate = this.datePipe.transform(this.orderDate, 'yyyy-MM-dd\'T\'HH:mm:ss');
    const statusList = Array.isArray(this.status) ? this.status : [];
    // Lọc đơn hàng với các tham số từ người dùng
    this.loadOrders(this.currentPage, this.rowsPerPage, this.orderCode, statusList, formattedDate);
  }

  loadOrders(page: number, size: number, orderCode: any = '', status: any = '', orderDate: any = '') {
    this.orderService.getAllOrders(page, size, orderCode, status, orderDate).subscribe((res: any) => {
      this.orderList = res.data.orderResponseList;
      this.totalRecords = res.data.totalRecords; // Cập nhật tổng số đơn hàng (hoặc `totalPages`)
      this.totalPages = res.data.totalPages;
    });
  }
  // Phương thức xóa bộ lọc
  onClearFilters(): void {
    this.status = [];  // Reset trạng thái
    this.orderDate = null;  // Reset ngày
    this.orderCode = '';  // Reset mã đơn hàng
    this.loadOrders(this.currentPage, this.rowsPerPage);  // Tải lại danh sách đơn hàng mà không có bộ lọc
  }
  // loadOrders(page: number, size: number) {
  //   this.orderService.getAllOrders(page, size).subscribe((res: any) => {
  //     this.orderList = res.data.orderResponseList;
  //     this.totalRecords = res.data.totalRecords; // Cập nhật tổng số đơn hàng (hoặc `totalPages`)
  //     this.totalPages = res.data.totalPages;
  //   });
  // }

  // cập nhật trạng thái đơn hàng 
  onStatusChange(order: any) {
    const oldStatus = order.status;
    this.orderService.updateOrderStatus(order.id, order.status).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cập nhật trạng thái thành công',
          detail: `Đơn hàng ${order.order_code} đã được cập nhật trạng thái thành công!`
        });
        order.statusDisplayName = this.getStatusDisplayName(order.status);
      },
      (error) => {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
        order.status = oldStatus;
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể cập nhật trạng thái đơn hàng.'
        });
        order.status = oldStatus;
      }
    );
  }


  getStatusDisplayName(status: string): string {
    const statusMap: { [key: string]: string } = {
      PENDING: 'Chờ xử lý',
      PROCESSING: 'Đang xử lý',
      SHIPPED: 'Đang giao hàng',
      DELIVERED: 'Đã giao hàng',
      CANCELLED: 'Đã huỷ'
    };
    return statusMap[status] || 'Không xác định';
  }
  getStatusClass(status: string): string {
    const statusClassMap: { [key: string]: string } = {
      PENDING: 'status-pending',
      PROCESSING: 'status-processing',
      SHIPPED: 'status-shipped',
      DELIVERED: 'status-delivered',
      CANCELLED: 'status-cancelled',
    };
    return statusClassMap[status] || '';
  }




  // Hàm gọi API để lấy chi tiết đơn hàng khi người dùng click vào mã đơn hàng
  showOrderDetails(orderId: number) {
    this.orderDetailService.getOrderDetailByOrderId(orderId).subscribe(
      (response: any) => {
        this.selectedOrderDetails = response.data.details; // Lưu trữ dữ liệu chi tiết đơn hàng
        this.totalMoney = response.data.total_money;
        this.address_id = response.data.address_id;

        this.status = response.data.status;
        this.displayDialog = true; // Mở dialog để hiển thị chi tiết
      },
      (error) => {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể lấy chi tiết đơn hàng.'
        });
      }
    );
  }

  formatPrice(price: number): string {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '';
  }



  // cancelUpdate() {
  //   this.displayUpdateDialog = false; // Close dialog
  // }


}



