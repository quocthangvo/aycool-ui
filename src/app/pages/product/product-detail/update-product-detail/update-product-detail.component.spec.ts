import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProductDetailComponent } from './update-product-detail.component';

describe('UpdateProductDetailComponent', () => {
  let component: UpdateProductDetailComponent;
  let fixture: ComponentFixture<UpdateProductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProductDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
