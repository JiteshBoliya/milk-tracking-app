import { Routes } from '@angular/router';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientDetailsComponent } from './client-details/client-details.component';

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
    path: ':id',
    component: ClientDetailsComponent
  },
  {
    path: ':id/edit',
    component: ClientFormComponent
  }
]; 