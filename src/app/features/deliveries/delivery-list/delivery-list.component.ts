import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DeliveryService } from '../../../services/delivery.service';
import { ClientService } from '../../../services/client.service';
import { Delivery } from '../../../models/delivery.model';
import { Client } from '../../../models/client.model';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-delivery-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Deliveries</mat-card-title>
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon>
          Add Delivery
        </button>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="filterForm" (ngSubmit)="applyFilters()">
          <div class="filter-row">
            <mat-form-field appearance="fill">
              <mat-label>Client</mat-label>
              <mat-select formControlName="clientId">
                <mat-option value="">All Clients</mat-option>
                <mat-option *ngFor="let client of clients$ | async" [value]="client.id">
                  {{client.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Start Date</mat-label>
              <input matInput [matDatepicker]="startPicker" formControlName="startDate">
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>End Date</mat-label>
              <input matInput [matDatepicker]="endPicker" formControlName="endDate">
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>

            <button mat-raised-button type="submit">Apply Filters</button>
            <button mat-button type="button" (click)="clearFilters()">Clear</button>
          </div>
        </form>

        <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let delivery">{{delivery.date | date}}</td>
          </ng-container>

          <ng-container matColumnDef="clientName">
            <th mat-header-cell *matHeaderCellDef>Client</th>
            <td mat-cell *matCellDef="let delivery">{{delivery.clientName}}</td>
          </ng-container>

          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef>Quantity (L)</th>
            <td mat-cell *matCellDef="let delivery">{{delivery.quantity}}</td>
          </ng-container>

          <ng-container matColumnDef="notes">
            <th mat-header-cell *matHeaderCellDef>Notes</th>
            <td mat-cell *matCellDef="let delivery">{{delivery.notes}}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let delivery">
              <button mat-icon-button [routerLink]="[delivery.id, 'edit']">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteDelivery(delivery.id!)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      margin: 20px;
    }
    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .filter-row {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .filter-row mat-form-field {
      flex: 1;
      min-width: 200px;
    }
    table {
      width: 100%;
    }
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
  `]
})
export class DeliveryListComponent implements OnInit {
  filterForm: FormGroup;
  clients$: Observable<Client[]>;
  filteredDeliveries$: Observable<Delivery[]>;
  dataSource = new MatTableDataSource<Delivery>([]);
  displayedColumns: string[] = ['date', 'clientName', 'quantity', 'notes', 'actions'];

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private clientService: ClientService,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      clientId: [''],
      startDate: [null],
      endDate: [null]
    });
    this.clients$ = this.clientService.getClients();
    this.filteredDeliveries$ = this.deliveryService.getDeliveriesByDateRange(new Date(0), new Date()).pipe(
      map(deliveries => deliveries || [])
    );
    this.filteredDeliveries$.subscribe(deliveries => {
      this.dataSource.data = deliveries || [];
    });
  }

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    const { clientId, startDate, endDate } = this.filterForm.value;
    
    this.filteredDeliveries$ = combineLatest([
      this.deliveryService.getDeliveriesByDateRange(
        startDate || new Date(0),
        endDate || new Date()
      ).pipe(map(deliveries => deliveries || [])),
      this.clients$
    ]).pipe(
      map(([deliveries, clients]) => {
        let filtered = deliveries;
        if (clientId) {
          filtered = filtered.filter(d => d.clientId === clientId);
        }
        return filtered.map(delivery => ({
          ...delivery,
          clientName: clients.find(c => c.id === delivery.clientId)?.name || 'Unknown'
        }));
      })
    );
    this.filteredDeliveries$.subscribe(deliveries => {
      this.dataSource.data = deliveries || [];
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.applyFilters();
  }

  deleteDelivery(deliveryId: string) {
    if (confirm('Are you sure you want to delete this delivery?')) {
      this.deliveryService.deleteDelivery(deliveryId).subscribe();
    }
  }
} 