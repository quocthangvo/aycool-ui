import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';


import { ProductComponent } from "../product/product.component";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselModule, ButtonModule, TagModule, ProductComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  images: string[] = []; // Mảng URL ảnh

  responsiveOptions: any[] | undefined;


  ngOnInit() {
    // Chỉ cần URL ảnh mẫu hoặc từ API
    this.images = [
      'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg',
      'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg',
      'https://primefaces.org/cdn/primeng/images/galleria/galleria3.jpg',
      'https://primefaces.org/cdn/primeng/images/galleria/galleria4.jpg',
      'https://primefaces.org/cdn/primeng/images/galleria/galleria5.jpg',
    ];

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

}
