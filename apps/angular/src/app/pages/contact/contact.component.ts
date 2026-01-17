import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    message: ''
  };

  errors: { [key: string]: string } = {};
  submitted = false;

  validate(): boolean {
    this.errors = {};

    if (!this.formData.name.trim()) {
      this.errors['name'] = 'Name is required';
    }

    if (!this.formData.email.trim()) {
      this.errors['email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(this.formData.email)) {
      this.errors['email'] = 'Email is invalid';
    }

    if (!this.formData.message.trim()) {
      this.errors['message'] = 'Message is required';
    }

    return Object.keys(this.errors).length === 0;
  }

  handleSubmit(): void {
    if (this.validate()) {
      console.log('Form submitted:', this.formData);
      this.submitted = true;
      this.formData = { name: '', email: '', message: '' };
      setTimeout(() => {
        this.submitted = false;
      }, 5000);
    }
  }
}
