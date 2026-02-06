import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { LogoutOverlayComponent } from './logout-overlay.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LogoutOverlayComponent', () => {
  let component: LogoutOverlayComponent;
  let fixture: ComponentFixture<LogoutOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutOverlayComponent, NoopAnimationsModule],
      providers: [
        provideRouter(routes)

      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LogoutOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
