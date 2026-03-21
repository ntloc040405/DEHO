import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contact = { name: '', email: '', message: '' };
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.successMessage = null;
    this.errorMessage = null;

    this.http.post('http://localhost:3000/contact', this.contact).subscribe({
      next: (response: any) => {
        this.successMessage = response.message || 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.';
        this.contact = { name: '', email: '', message: '' };
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Có lỗi xảy ra, vui lòng thử lại.';
        console.error('Error submitting contact form:', error);
      }
    });
  }
}
