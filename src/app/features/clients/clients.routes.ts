import { Routes } from '@angular/router';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ReportComponent } from './report/report.component';

export const CLIENTS_ROUTES: Routes = [
  {
    path: '',
    component: ClientListComponent
  },
  {
    path: 'new',
    component: ClientFormComponent
  },
    {
    path: 'report',
    component: ReportComponent
  },
  {
    path: ':id',
    component: ClientDetailsComponent
  },
  {
    path: ':id/edit',
    component: ClientFormComponent
  }
]; 