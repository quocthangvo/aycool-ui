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

      'https://intphcm.com/data/upload/mau-banner-thoi-trang-nam.jpg',
      'https://intphcm.com/data/upload/banner-thoi-trang-nam.jpg',
      'https://media3.coolmate.me/cdn-cgi/image/width=1920,quality=90,format=auto/uploads/November2024/Hero_Banner_-_Desktop_SL_SSS.jpg',
      'https://media3.coolmate.me/cdn-cgi/image/width=1920,quality=90,format=auto/uploads/November2024/Hero_Banner_-_Desktop_2_KW.jpg',
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
