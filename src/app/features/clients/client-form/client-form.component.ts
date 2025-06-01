import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl:'./client-form.component.html',
  styleUrls: ['./client-form.component.scss']
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
    this.clientForm = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl(''),
      contact: new FormControl(''),
      milkType: new FormControl('cow', Validators.required),
      // quantityPerDay: new FormControl(0, [Validators.required, Validators.min(0)]),
      ratePerLiter: new FormControl(0, [Validators.required, Validators.min(0)])
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