import { Component, ViewEncapsulation } from '@angular/core';
import { CreatePriceComponent } from "../create-price/create-price.component";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PriceService } from '../../../services/price/price.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-price-list',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule,
    ConfirmDialogModule, DialogModule, InputTextModule, FormsModule, CreatePriceComponent, RouterLink],
  providers: [ConfirmationService],
  templateUrl: './price-list.component.html',
  styleUrl: './price-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PriceListComponent {

  selectedColor: any = {}


  priceList: any[] = [];
  displayDialog: boolean = false;

  constructor(
    private priceService: PriceService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadPrices();
  }

  loadPrices() {
    this.priceService.getAllPrices().subscribe((res: any) => {
      this.priceList = res.data;
    })
  }

}
