import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductChartComponent } from './product-chart.component';

describe('ProductChartComponent', () => {
  let component: ProductChartComponent;
  let fixture: ComponentFixture<ProductChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
