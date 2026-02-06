import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { KapcsolatComponent } from './kapcsolat.component';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';

describe('KapcsolatComponent', () => {
  let component: KapcsolatComponent;
  let fixture: ComponentFixture<KapcsolatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KapcsolatComponent],
      providers: [
      provideHttpClient(),        
      provideHttpClientTesting(),
      provideRouter(routes)
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KapcsolatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
