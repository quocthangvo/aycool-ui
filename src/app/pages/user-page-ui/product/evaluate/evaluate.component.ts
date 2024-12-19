import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-evaluate',
  standalone: true,
  imports: [DropdownModule, FormsModule],
  templateUrl: './evaluate.component.html',
  styleUrl: './evaluate.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EvaluateComponent {

}
