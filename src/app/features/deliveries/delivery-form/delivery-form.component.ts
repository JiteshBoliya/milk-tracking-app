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
  templateUrl: './delivery-form.component.html',
  styleUrls: ['./delivery-form.component.scss']
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