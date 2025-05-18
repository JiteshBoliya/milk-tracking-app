import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Clients</mat-card-title>
        <button mat-raised-button color="primary" routerLink="new">
          <mat-icon>add</mat-icon>
          Add New Client
        </button>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="clients" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let client">{{client.name}}</td>
          </ng-container>

          <ng-container matColumnDef="contact">
            <th mat-header-cell *matHeaderCellDef>Contact</th>
            <td mat-cell *matCellDef="let client">{{client.contact}}</td>
          </ng-container>

          <ng-container matColumnDef="milkType">
            <th mat-header-cell *matHeaderCellDef>Milk Type</th>
            <td mat-cell *matCellDef="let client">{{client.milkType}}</td>
          </ng-container>

          <ng-container matColumnDef="quantityPerDay">
            <th mat-header-cell *matHeaderCellDef>Quantity/Day</th>
            <td mat-cell *matCellDef="let client">{{client.quantityPerDay}}L</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let client">
              <button mat-icon-button [routerLink]="[client.id]">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button [routerLink]="[client.id, 'edit']">
                <mat-icon>edit</mat-icon>
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
    table {
      width: 100%;
    }
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
  `]
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  displayedColumns: string[] = ['name', 'contact', 'milkType', 'quantityPerDay', 'actions'];

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
    });
  }
} 