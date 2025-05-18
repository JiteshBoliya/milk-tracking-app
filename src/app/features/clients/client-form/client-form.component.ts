import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{isEditMode ? 'Edit' : 'Add'}} Client</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="fill">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" required>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Address</mat-label>
            <textarea matInput formControlName="address" required></textarea>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Contact</mat-label>
            <input matInput formControlName="contact" required>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Milk Type</mat-label>
            <mat-select formControlName="milkType" required>
              <mat-option value="cow">Cow</mat-option>
              <mat-option value="buffalo">Buffalo</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Quantity per Day (Liters)</mat-label>
            <input matInput type="number" formControlName="quantityPerDay" required>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Rate per Liter</mat-label>
            <input matInput type="number" formControlName="ratePerLiter" required>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="goBack()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="clientForm.invalid">
              {{isEditMode ? 'Update' : 'Save'}}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      margin: 20px;
      max-width: 600px;
      margin: 20px auto;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
  `]
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  isEditMode = false;
  clientId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      contact: ['', Validators.required],
      milkType: ['cow', Validators.required],
      quantityPerDay: [0, [Validators.required, Validators.min(0)]],
      ratePerLiter: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('id');
    if (this.clientId) {
      this.isEditMode = true;
      this.clientService.getClientById(this.clientId).subscribe(client => {
        if (client) {
          this.clientForm.patchValue(client);
        }
      });
    }
  }

  onSubmit() {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      if (this.isEditMode && this.clientId) {
        this.clientService.updateClient(this.clientId, clientData)
          .then(() => this.goBack());
      } else {
        this.clientService.addClient(clientData)
          .then(() => this.goBack());
      }
    }
  }

  goBack() {
    this.router.navigate(['/clients']);
  }
} 