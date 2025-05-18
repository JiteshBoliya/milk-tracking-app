import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { DeliveryService } from '../../../services/delivery.service';
import { ClientService } from '../../../services/client.service';
import { Delivery } from '../../../models/delivery.model';
import { Client } from '../../../models/client.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-delivery-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatSelectModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{isEditMode ? 'Edit' : 'Add'}} Delivery</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="deliveryForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="fill" *ngIf="!clientId">
            <mat-label>Client</mat-label>
            <mat-select formControlName="clientId" required>
              <mat-option *ngFor="let client of clients$ | async" [value]="client.id">
                {{client.name}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" required>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Quantity (Liters)</mat-label>
            <input matInput type="number" formControlName="quantity" required>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Notes</mat-label>
            <textarea matInput formControlName="notes"></textarea>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="goBack()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="deliveryForm.invalid">
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
export class DeliveryFormComponent implements OnInit {
  deliveryForm: FormGroup;
  isEditMode = false;
  deliveryId: string | null = null;
  clientId: string | null = null;
  clients$: Observable<Client[]>;

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.deliveryForm = this.fb.group({
      clientId: ['', Validators.required],
      date: [new Date(), Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      notes: ['']
    });
    this.clients$ = this.clientService.getClients();
  }

  ngOnInit() {
    this.clientId = this.route.snapshot.queryParamMap.get('clientId');
    if (this.clientId) {
      this.deliveryForm.patchValue({ clientId: this.clientId });
    }

    this.deliveryId = this.route.snapshot.paramMap.get('id');
    if (this.deliveryId) {
      this.isEditMode = true;
      // Load delivery data for editing
      // Implementation needed
    }
  }

  onSubmit() {
    if (this.deliveryForm.valid) {
      const deliveryData = this.deliveryForm.value;
      if (this.isEditMode && this.deliveryId) {
        this.deliveryService.updateDelivery(this.deliveryId, deliveryData)
          .then(() => this.goBack());
      } else {
        this.deliveryService.addDelivery(deliveryData)
          .then(() => this.goBack());
      }
    }
  }

  goBack() {
    if (this.clientId) {
      this.router.navigate(['/clients', this.clientId]);
    } else {
      this.router.navigate(['/deliveries']);
    }
  }
} 