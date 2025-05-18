import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClientService } from '../../../services/client.service';
import { DeliveryService } from '../../../services/delivery.service';
import { Client } from '../../../models/client.model';
import { Delivery } from '../../../models/delivery.model';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule
  ],
  template: `
    <div class="client-details">
      <mat-card *ngIf="client$ | async as client">
        <mat-card-header>
          <mat-card-title>{{client.name}}</mat-card-title>
          <button mat-icon-button [routerLink]="['edit']">
            <mat-icon>edit</mat-icon>
          </button>
        </mat-card-header>
        <mat-card-content>
          <div class="client-info">
            <p><strong>Address:</strong> {{client.address}}</p>
            <p><strong>Contact:</strong> {{client.contact}}</p>
            <p><strong>Milk Type:</strong> {{client.milkType}}</p>
            <p><strong>Quantity per Day:</strong> {{client.quantityPerDay}}L</p>
            <p><strong>Rate per Liter:</strong> ₹{{client.ratePerLiter}}</p>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="delivery-history">
        <mat-card-header>
          <mat-card-title>Delivery History</mat-card-title>
          <button mat-raised-button color="primary" (click)="addDelivery()">
            <mat-icon>add</mat-icon>
            Add Delivery
          </button>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let delivery">{{delivery.date | date}}</td>
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
                <button mat-icon-button (click)="editDelivery(delivery)">
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
    </div>
  `,
  styles: [`
    .client-details {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .client-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    .delivery-history {
      margin-top: 20px;
    }
    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
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
export class ClientDetailsComponent implements OnInit {
  client$: Observable<Client | null>;
  deliveries$: Observable<Delivery[]>;
  dataSource = new MatTableDataSource<Delivery>([]);
  displayedColumns: string[] = ['date', 'quantity', 'notes', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private deliveryService: DeliveryService
  ) {
    const clientId = this.route.snapshot.paramMap.get('id')!;
    this.client$ = this.clientService.getClientById(clientId);
    this.deliveries$ = this.deliveryService.getDeliveriesByClient(clientId);
    this.deliveries$.subscribe(deliveries => {
      this.dataSource.data = deliveries || [];
    });
  }

  ngOnInit() {}

  addDelivery() {
    const clientId = this.route.snapshot.paramMap.get('id')!;
    this.router.navigate(['/deliveries/new'], { queryParams: { clientId } });
  }

  editDelivery(delivery: Delivery) {
    this.router.navigate(['/deliveries', delivery.id, 'edit']);
  }

  deleteDelivery(deliveryId: string) {
    if (confirm('Are you sure you want to delete this delivery?')) {
      this.deliveryService.deleteDelivery(deliveryId).subscribe();
    }
  }
} 