import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';
import { ReportComponent } from "../report/report.component";

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  displayedColumns: string[] = ['name', 'contact', 'milkType', 'quantityPerDay', 'actions'];

  constructor(
    private clientService: ClientService,
    // private router: Router
  
  ) {}

  ngOnInit() {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
    });
  }
} 