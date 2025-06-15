import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
    RouterModule
  ],
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {
  client: Client | null = null;
  deliveries: any;
  displayedColumns: string[] = ['date', 'quantity', 'notes', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private deliveryService: DeliveryService
  ) {
    const clientId = this.route.snapshot.paramMap.get('id')!;
    this.clientService.getClientById(clientId).subscribe((res) => {
        this.client = res;
    });
    
    this.deliveryService.getDeliveriesByClient(clientId).subscribe({
      next: (res) => {
      console.log('----------',res);
      
      this.deliveries = res;
    },
    error: (err) => {
      console.log('++++++++', err);
      
    }
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