import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    RouterModule
  ],
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent implements OnInit {
  filterForm: FormGroup;
  clients$: Observable<Client[]>;
  filteredDeliveries$: Observable<Delivery[]>;
  dataSource: any;
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
      this.dataSource = deliveries || [];
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