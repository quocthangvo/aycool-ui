import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TokenInterceptor } from './interceptors/token.interceptor';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  providers: [MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'aycool-admin-ui';
  isLoading = true;

  ngOnInit() {
    this.showLoadingAndRedirect();
  }

  private showLoadingAndRedirect() {
    // Hiển thị loading trong 3 giây
    setTimeout(() => {
      this.isLoading = false; // Ẩn loading sau 3 giây
    }, 1000); // Delay 1s 
  }

}
