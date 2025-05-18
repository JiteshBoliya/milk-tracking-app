import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'clients',
    pathMatch: 'full'
  },
  {
    path: 'clients',
    loadChildren: () => import('./features/clients/clients.routes').then(m => m.CLIENTS_ROUTES)
  },
  {
    path: 'deliveries',
    loadChildren: () => import('./features/deliveries/deliveries.routes').then(m => m.DELIVERIES_ROUTES)
  }
];
