import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-kapcsolat",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./kapcsolat.component.html",
})
export class KapcsolatComponent {
  contactForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
    this.contactForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: [
        "",
        [Validators.required, Validators.email, Validators.maxLength(120)],
      ],
      subject: ["", [Validators.required, Validators.maxLength(150)]],
      message: ["", [Validators.required, Validators.minLength(10)]],
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.http
      .post("http://localhost:3000/api/send-mail", this.contactForm.value)
      .subscribe(() => {
        this.submitted = true;
        this.contactForm.reset();
      });
  }
}
